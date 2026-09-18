import path from "node:path";
import "./errors-BoHeli7m.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  n as listAgentIds,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import {
  n as externalCliDiscoveryForProviderAuth,
  r as externalCliDiscoveryForProviders,
} from "./external-cli-discovery-To6-j7MZ.js";
import "./auth-profiles-CX7JDmZ9.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-CHBQPrVn.js";
import {
  a as createRuntimeProviderAuthLookup,
  c as hasAvailableAuthForProvider,
  l as hasRuntimeAvailableProviderAuth,
} from "./model-auth-BWFdcEzF.js";
import "./model-selection-DOlkTrQa.js";
import { n as loadModelCatalog } from "./model-catalog-DxYvPELu.js";
import {
  a as getCurrentProviderAuthStates,
  c as setCurrentProviderAuthWarmWorker,
  i as clearCurrentProviderAuthWarmWorker,
  n as claimCurrentProviderAuthStateGeneration,
  o as isCurrentProviderAuthStateGeneration,
  s as publishProviderAuthWarmSnapshot,
  t as cancelCurrentProviderAuthWarmWorker,
} from "./model-provider-auth-state-DW_JYm-o.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import "./workspace-DXzCbuC0.js";
import { l as hashRuntimeConfigValue } from "./runtime-snapshot-BbbqRiDR.js";
import {
  c as getRuntimeAuthProfileStoreSnapshot,
  i as ensureAuthProfileStore,
  o as ensureAuthProfileStoreWithoutExternalProfiles,
} from "./store-B7DoDdVM.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
//#region src/agents/model-provider-auth.ts
/**
 * Warms and queries provider-auth availability for model catalogs. The module
 * keeps per-agent auth snapshots process-current so model listing can avoid
 * repeated env/profile/plugin discovery on hot paths.
 */
const PROVIDER_AUTH_WARM_WORKER_TIMEOUT_MS = 12e4;
const PROVIDER_AUTH_WARM_CANCEL_POLL_MS = 25;
const configFingerprintCache = /* @__PURE__ */ new WeakMap();
function resolvePreparedStateForCaller(params) {
  if (!params.states) return null;
  if (params.callerAgentId !== void 0) return params.states.get(params.callerAgentId) ?? null;
  if (!params.cfg) return null;
  return params.states.get(resolveDefaultAgentId(params.cfg)) ?? null;
}
function resolveProviderAuthConfigFingerprint(cfg) {
  if (!cfg) return null;
  const cached = configFingerprintCache.get(cfg);
  if (cached !== void 0) return cached;
  const fingerprint = hashRuntimeConfigValue(cfg);
  configFingerprintCache.set(cfg, fingerprint);
  return fingerprint;
}
/** Resolves whether auth is available for a model provider in the caller's runtime scope. */
async function hasAuthForModelProvider(params) {
  const provider = normalizeProviderId(params.provider);
  const preparedStates = getCurrentProviderAuthStates();
  const workspaceDir = params.workspaceDir ?? resolveDefaultAgentWorkspaceDir();
  const configFingerprint = resolveProviderAuthConfigFingerprint(params.cfg);
  const preparedState = resolvePreparedStateForCaller({
    states: preparedStates,
    cfg: params.cfg,
    callerAgentId: params.agentId,
  });
  const expectedWorkspaceDir =
    preparedState !== null && params.cfg
      ? resolveAgentWorkspaceDir(params.cfg, preparedState.agentId)
      : null;
  const expectedAgentDir =
    preparedState !== null && params.cfg
      ? resolveAgentDir(params.cfg, preparedState.agentId)
      : null;
  if (
    preparedState !== null &&
    configFingerprint === preparedState.configFingerprint &&
    workspaceDir === expectedWorkspaceDir &&
    (params.agentDir === void 0 || params.agentDir === expectedAgentDir) &&
    (params.allowPreparedRuntimeAuth === true ||
      (params.discoverExternalCliAuth !== false && params.allowPluginSyntheticAuth !== false)) &&
    params.env === void 0 &&
    params.store === void 0 &&
    params.modelApi === void 0
  ) {
    const preparedAnswer = preparedState.providers.get(provider);
    if (preparedAnswer !== void 0) return preparedAnswer;
  }
  await new Promise((resolve) => {
    setImmediate(resolve);
  });
  if (
    hasRuntimeAvailableProviderAuth({
      provider,
      cfg: params.cfg,
      workspaceDir: params.workspaceDir,
      env: params.env,
      allowPluginSyntheticAuth: params.allowPluginSyntheticAuth,
      runtimeLookup: params.runtimeAuthLookup ?? params.resolveRuntimeAuthLookup?.(),
      modelApi: params.modelApi,
    })
  )
    return true;
  const slowPathAgentDir =
    params.agentDir ??
    (params.agentId && params.cfg
      ? resolveAgentDir(params.cfg, params.agentId, params.env)
      : void 0);
  const store =
    params.store ??
    (params.discoverExternalCliAuth === false
      ? ensureAuthProfileStoreWithoutExternalProfiles(slowPathAgentDir, {
          allowKeychainPrompt: false,
        })
      : ensureAuthProfileStore(slowPathAgentDir, {
          externalCli: externalCliDiscoveryForProviderAuth({
            cfg: params.cfg,
            provider,
          }),
        }));
  if (listProfilesForProvider(store, provider).length > 0)
    return params.modelApi === void 0
      ? true
      : await hasAvailableAuthForProvider({
          provider,
          modelApi: params.modelApi,
          cfg: params.cfg,
          workspaceDir: params.workspaceDir,
          agentDir: slowPathAgentDir,
          store,
        });
  return false;
}
/** Creates a cached provider-auth evaluator bound to one agent/runtime context. */
function createProviderAuthChecker(params) {
  const authCache = /* @__PURE__ */ new Map();
  let runtimeAuthLookup;
  let modelAuthResolver;
  const resolveModelAuthResolver = () => {
    if (modelAuthResolver) return modelAuthResolver;
    const agentDir =
      params.agentDir ??
      (params.agentId && params.cfg
        ? resolveAgentDir(params.cfg, params.agentId, params.env)
        : void 0);
    const authStore = ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
      allowKeychainPrompt: false,
    });
    runtimeAuthLookup ??= createRuntimeProviderAuthLookup({
      cfg: params.cfg,
      workspaceDir: params.workspaceDir,
      env: params.env,
      includePluginSyntheticAuth: params.allowPluginSyntheticAuth !== false,
    });
    modelAuthResolver = createModelAuthAvailabilityResolver({
      cfg: params.cfg ?? {},
      authStore,
      agentDir,
      workspaceDir: params.workspaceDir,
      env: params.env,
      skipSetupProviderFallback: true,
      allowPreparedRuntimeAuth:
        params.allowPreparedRuntimeAuth === true ||
        (params.discoverExternalCliAuth !== false && params.allowPluginSyntheticAuth !== false),
      syntheticAuthProviderRefs: runtimeAuthLookup.syntheticAuthProviderRefs,
      ...(params.discoverExternalCliAuth === false ? {} : { externalCliProviderIds: ["openai"] }),
    });
    return modelAuthResolver;
  };
  const evaluateModelAuth = (provider, ref = {}) => {
    const key = normalizeProviderId(provider);
    const hasRouteFacts =
      ref.modelId !== void 0 ||
      ref.api !== void 0 ||
      ref.baseUrl !== void 0 ||
      ref.observedRoutes !== void 0;
    const cacheKey = hasRouteFacts ? `${key}\0${hashRuntimeConfigValue(ref)}` : key;
    const cached = authCache.get(cacheKey);
    if (cached) return cached;
    const resolveLegacyProviderAuth = () =>
      hasAuthForModelProvider({
        provider: key,
        modelApi: typeof ref.api === "string" ? ref.api : void 0,
        cfg: params.cfg,
        workspaceDir: params.workspaceDir,
        agentDir: params.agentDir,
        agentId: params.agentId,
        env: params.env,
        allowPluginSyntheticAuth: params.allowPluginSyntheticAuth,
        discoverExternalCliAuth: params.discoverExternalCliAuth,
        allowPreparedRuntimeAuth: params.allowPreparedRuntimeAuth,
        resolveRuntimeAuthLookup: () =>
          (runtimeAuthLookup ??= createRuntimeProviderAuthLookup({
            cfg: params.cfg,
            workspaceDir: params.workspaceDir,
            env: params.env,
            includePluginSyntheticAuth: params.allowPluginSyntheticAuth !== false,
          })),
      });
    const evaluation = Promise.resolve().then(async () => {
      if (hasRouteFacts) return resolveModelAuthResolver().evaluateModelAuth(key, ref);
      return {
        availability: await resolveLegacyProviderAuth(),
        routeResolution: null,
      };
    });
    authCache.set(cacheKey, evaluation);
    evaluation.catch(() => {
      if (authCache.get(cacheKey) === evaluation) authCache.delete(cacheKey);
    });
    return evaluation;
  };
  return Object.assign(
    async (provider, ref = {}) => (await evaluateModelAuth(provider, ref)).availability === true,
    { evaluateModelAuth },
  );
}
function serializeProviderAuthStates(states) {
  return {
    agents: [...states.values()].map((state) => ({
      agentId: state.agentId,
      configFingerprint: state.configFingerprint,
      providers: [...state.providers.entries()],
    })),
  };
}
function resolveProviderConfigApi(cfg, provider) {
  const providers = cfg?.models?.providers ?? {};
  const direct = providers[provider];
  if (direct?.api) return direct.api;
  const normalized = normalizeProviderId(provider);
  return Object.entries(providers).find(([key]) => normalizeProviderId(key) === normalized)?.[1]
    ?.api;
}
function shouldOmitFalsePreparedAuthForProcessSyntheticProvider(params) {
  const syntheticRefs = params.runtimeAuthLookup.syntheticAuthProviderRefs;
  if (!syntheticRefs?.length) return false;
  const eligibleRefs = new Set(syntheticRefs.map((ref) => normalizeProviderId(ref)));
  const providerApi = resolveProviderConfigApi(params.cfg, params.provider);
  return [params.provider, providerApi]
    .filter((ref) => typeof ref === "string" && ref.trim().length > 0)
    .some((ref) => eligibleRefs.has(normalizeProviderId(ref)));
}
/** Builds a provider auth snapshot for every configured agent. */
async function buildCurrentProviderAuthStateSnapshot(cfg, options = {}) {
  const isWarmStale = () => options.isCancelled?.() === true;
  const catalog = await loadModelCatalog({
    config: cfg,
    readOnly: true,
  });
  if (isWarmStale()) return { agents: [] };
  const providers = /* @__PURE__ */ new Set();
  for (const entry of catalog) providers.add(normalizeProviderId(entry.provider));
  const providerList = [...providers];
  const configFingerprint = resolveProviderAuthConfigFingerprint(cfg) ?? "";
  const states = /* @__PURE__ */ new Map();
  for (const agentId of listAgentIds(cfg)) {
    if (isWarmStale()) return { agents: [] };
    const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
    const agentDir = resolveAgentDir(cfg, agentId);
    const runtimeAuthLookup =
      options.runtimeAuthLookups?.get(agentId) ??
      createRuntimeProviderAuthLookup({
        cfg,
        workspaceDir,
      });
    const externalCli = externalCliDiscoveryForProviders({
      cfg,
      providers: providerList,
    });
    const store = options.readOnlyAuthStore
      ? ensureAuthProfileStore(agentDir, {
          config: cfg,
          externalCli,
          readOnly: true,
          syncExternalCli: false,
        })
      : ensureAuthProfileStore(agentDir, {
          config: cfg,
          externalCli,
        });
    const state = /* @__PURE__ */ new Map();
    for (const provider of providers) {
      if (isWarmStale()) return { agents: [] };
      const value = await hasAuthForModelProvider({
        provider,
        cfg,
        workspaceDir,
        agentId,
        store,
        runtimeAuthLookup,
      });
      if (
        !value &&
        (options.omitFalseProviderAuth ||
          shouldOmitFalsePreparedAuthForProcessSyntheticProvider({
            cfg,
            provider,
            runtimeAuthLookup,
          }))
      )
        continue;
      state.set(provider, value);
    }
    states.set(agentId, {
      agentId,
      configFingerprint,
      providers: state,
    });
  }
  return serializeProviderAuthStates(states);
}
function resolveProviderAuthWarmWorkerUrl(currentModuleUrl) {
  const currentPath = fileURLToPath(currentModuleUrl);
  const distMarker = `${path.sep}dist${path.sep}`;
  const distIndex = currentPath.lastIndexOf(distMarker);
  if (distIndex >= 0) {
    const distRoot = currentPath.slice(0, distIndex + distMarker.length - 1);
    return pathToFileURL(path.join(distRoot, "agents", "model-provider-auth.worker.js"));
  }
  const extension = path.extname(currentPath) || ".js";
  return new URL(`./model-provider-auth.worker${extension}`, currentModuleUrl);
}
function isProviderAuthWarmSnapshot(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.agents)) return false;
  return value.agents.every(
    (agent) =>
      typeof agent.agentId === "string" &&
      typeof agent.configFingerprint === "string" &&
      Array.isArray(agent.providers) &&
      agent.providers.every(
        (entry) =>
          Array.isArray(entry) &&
          entry.length === 2 &&
          typeof entry[0] === "string" &&
          typeof entry[1] === "boolean",
      ),
  );
}
function isProviderAuthWarmWorkerResult(value) {
  if (!value || typeof value !== "object") return false;
  const result = value;
  if (result.status === "failed") return typeof result.error === "string";
  return result.status === "ok" && isProviderAuthWarmSnapshot(result.snapshot);
}
function createProviderAuthWarmPresenceStore(store) {
  const profiles = {};
  for (const [profileId, credential] of Object.entries(store.profiles))
    profiles[profileId] = {
      type: "api_key",
      provider: credential.provider,
    };
  return {
    version: store.version,
    profiles,
  };
}
function collectProviderAuthWarmRuntimeAuthStores(cfg) {
  const entries = [];
  const seen = /* @__PURE__ */ new Set();
  const addStore = (agentDir) => {
    if (seen.has(agentDir)) return;
    seen.add(agentDir);
    const store = getRuntimeAuthProfileStoreSnapshot(agentDir);
    if (!store) return;
    entries.push({
      ...(agentDir === void 0 ? {} : { agentDir }),
      store: createProviderAuthWarmPresenceStore(store),
    });
  };
  addStore();
  for (const agentId of listAgentIds(cfg)) addStore(resolveAgentDir(cfg, agentId));
  return entries;
}
function collectProviderAuthWarmRuntimeAuthLookups(cfg) {
  const entries = [];
  let omitFalseProviderAuth = false;
  for (const agentId of listAgentIds(cfg)) {
    const lookup = createRuntimeProviderAuthLookup({
      cfg,
      workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
    });
    if (lookup.syntheticAuthProviderRefsComplete === false) omitFalseProviderAuth = true;
    entries.push({
      agentId,
      lookup,
    });
  }
  return {
    entries,
    omitFalseProviderAuth,
  };
}
function runProviderAuthWarmWorker(params) {
  const worker = new Worker(params.workerUrl ?? resolveProviderAuthWarmWorkerUrl(import.meta.url), {
    workerData: {
      cfg: params.cfg,
      ...(params.runtimeAuthStores?.length ? { runtimeAuthStores: params.runtimeAuthStores } : {}),
      ...(params.runtimeAuthLookups?.length
        ? { runtimeAuthLookups: params.runtimeAuthLookups }
        : {}),
      ...(params.omitFalseProviderAuth ? { omitFalseProviderAuth: true } : {}),
    },
  });
  worker.unref?.();
  const handle = {
    worker,
    cancelled: false,
  };
  setCurrentProviderAuthWarmWorker(handle);
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (complete) => {
      if (settled) return;
      settled = true;
      clearCurrentProviderAuthWarmWorker(handle);
      if (timer) clearTimeout(timer);
      if (cancelTimer) clearInterval(cancelTimer);
      complete();
    };
    const cancelWorker = () => {
      handle.cancelled = true;
      worker.terminate();
      finish(() => resolve({ agents: [] }));
    };
    const timer = setTimeout(() => {
      handle.cancelled = true;
      worker.terminate();
      finish(() => reject(/* @__PURE__ */ new Error("provider auth warm worker timed out")));
    }, params.timeoutMs);
    timer.unref?.();
    const cancelTimer = setInterval(() => {
      if (params.isCancelled()) cancelWorker();
    }, PROVIDER_AUTH_WARM_CANCEL_POLL_MS);
    cancelTimer.unref?.();
    worker.once("message", (message) => {
      worker.terminate();
      finish(() => {
        if (handle.cancelled) {
          resolve({ agents: [] });
          return;
        }
        if (!isProviderAuthWarmWorkerResult(message)) {
          reject(/* @__PURE__ */ new Error("invalid provider auth warm worker response"));
          return;
        }
        if (message.status === "failed") {
          reject(new Error(message.error));
          return;
        }
        resolve(message.snapshot);
      });
    });
    worker.once("error", (error) => {
      finish(() => {
        if (handle.cancelled) {
          resolve({ agents: [] });
          return;
        }
        reject(toErrorObject(error, "Non-Error rejection"));
      });
    });
    worker.once("exit", (code) => {
      if (settled || code === 0) return;
      finish(() => {
        if (handle.cancelled) {
          resolve({ agents: [] });
          return;
        }
        reject(/* @__PURE__ */ new Error(`provider auth warm worker exited with code ${code}`));
      });
    });
    if (params.isCancelled()) cancelWorker();
  });
}
/** Warms process-current provider auth state in a worker thread. */
async function warmCurrentProviderAuthStateOffMainThread(cfg, options = {}) {
  const ownGeneration = claimCurrentProviderAuthStateGeneration();
  cancelCurrentProviderAuthWarmWorker();
  const isWarmStale = () =>
    options.isCancelled?.() === true || !isCurrentProviderAuthStateGeneration(ownGeneration);
  if (isWarmStale()) return;
  const runtimeAuthStores = collectProviderAuthWarmRuntimeAuthStores(cfg);
  const runtimeAuthLookups = collectProviderAuthWarmRuntimeAuthLookups(cfg);
  const snapshot = await (options.runWorker ?? runProviderAuthWarmWorker)({
    cfg,
    ...(runtimeAuthStores.length ? { runtimeAuthStores } : {}),
    ...(runtimeAuthLookups.entries.length
      ? { runtimeAuthLookups: runtimeAuthLookups.entries }
      : {}),
    ...(runtimeAuthLookups.omitFalseProviderAuth ? { omitFalseProviderAuth: true } : {}),
    timeoutMs: options.timeoutMs ?? PROVIDER_AUTH_WARM_WORKER_TIMEOUT_MS,
    isCancelled: isWarmStale,
    workerUrl: options.workerUrl,
  });
  if (isWarmStale()) return;
  publishProviderAuthWarmSnapshot(snapshot);
}
//#endregion
export {
  warmCurrentProviderAuthStateOffMainThread as i,
  createProviderAuthChecker as n,
  hasAuthForModelProvider as r,
  buildCurrentProviderAuthStateSnapshot as t,
};
