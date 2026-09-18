import "./agent-scope-y9xQv_q1.js";
import { n as discoverModels, t as discoverAuthStorage } from "./agent-model-discovery-CHpHGXmv.js";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import {
  n as formatErrorWithStack,
  r as shouldFallbackToAuthHeuristics,
  t as MODEL_AVAILABILITY_UNAVAILABLE_CODE,
} from "./list.errors-DDA-CnZS.js";
import { t as resolveModelPluginMetadataSnapshot } from "./model-discovery-context-B688uj_v.js";
import { i as modelKey } from "./model-selection-normalize-BoKGJiBx.js";
import "./shared-DFGOIlxJ.js";
import {
  i as shouldSuppressBuiltInModelFromManifest,
  r as shouldSuppressBuiltInModel,
} from "./model-suppression-BEIowhn6.js";
//#region src/agents/model-registry-loader.ts
/** Load the agent model registry with optional provider filtering/normalization. */
function loadAgentModelRegistry(config, options = {}) {
  const agentDir = resolveDefaultAgentDir(config);
  const authStorage = discoverAuthStorage(agentDir, {
    readOnly: options.readOnly ?? true,
    skipCredentials: options.skipCredentials,
    config,
    workspaceDir: options.workspaceDir,
  });
  const pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
    config,
    workspaceDir: options.workspaceDir,
  });
  return {
    agentDir,
    registry: discoverModels(authStorage, agentDir, {
      config,
      ...(pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}),
      providerFilter: options.providerFilter,
      ...(options.workspaceDir ? { workspaceDir: options.workspaceDir } : {}),
      normalizeModels: options.normalizeModels,
    }),
  };
}
//#endregion
//#region src/commands/models/list.registry.ts
/** Model registry access helpers for `openclaw models list`. */
function createAvailabilityUnavailableError(message) {
  const err = new Error(message);
  err.code = MODEL_AVAILABILITY_UNAVAILABLE_CODE;
  return err;
}
function normalizeAvailabilityError(err) {
  if (shouldFallbackToAuthHeuristics(err) && err instanceof Error) return err;
  return createAvailabilityUnavailableError(
    `Model availability unavailable: getAvailable() failed.\n${formatErrorWithStack(err)}`,
  );
}
function validateAvailableModels(availableModels) {
  if (!Array.isArray(availableModels))
    throw createAvailabilityUnavailableError(
      "Model availability unavailable: getAvailable() returned a non-array value.",
    );
  for (const model of availableModels)
    if (
      !model ||
      typeof model !== "object" ||
      typeof model.provider !== "string" ||
      typeof model.id !== "string"
    )
      throw createAvailabilityUnavailableError(
        "Model availability unavailable: getAvailable() returned invalid model entries.",
      );
  return availableModels;
}
function loadAvailableModels(registry, cfg, opts) {
  let availableModels;
  try {
    availableModels = registry.getAvailable();
  } catch (err) {
    throw normalizeAvailabilityError(err);
  }
  try {
    return validateAvailableModels(availableModels).filter((model) =>
      opts?.runtimeSuppression === false
        ? !shouldSuppressBuiltInModelFromManifest({
            provider: model.provider,
            id: model.id,
            baseUrl: model.baseUrl,
            config: cfg,
          })
        : !shouldSuppressBuiltInModel({
            provider: model.provider,
            id: model.id,
            baseUrl: model.baseUrl,
            config: cfg,
          }),
    );
  } catch (err) {
    throw normalizeAvailabilityError(err);
  }
}
/** Loads registry models and optional availability keys with suppression applied. */
async function loadModelRegistry(cfg, opts) {
  const runtimeSuppression = opts?.normalizeModels !== false;
  const { registry } = loadAgentModelRegistry(cfg, {
    skipCredentials: opts?.loadAvailability === false,
    workspaceDir: opts?.workspaceDir,
    providerFilter: opts?.providerFilter,
    normalizeModels: opts?.normalizeModels,
  });
  const models = registry.getAll().filter((model) =>
    runtimeSuppression
      ? !shouldSuppressBuiltInModel({
          provider: model.provider,
          id: model.id,
          baseUrl: model.baseUrl,
          config: cfg,
        })
      : !shouldSuppressBuiltInModelFromManifest({
          provider: model.provider,
          id: model.id,
          baseUrl: model.baseUrl,
          config: cfg,
        }),
  );
  let availableKeys;
  let availabilityErrorMessage;
  if (opts?.loadAvailability !== false)
    try {
      const availableModels = loadAvailableModels(registry, cfg, { runtimeSuppression });
      availableKeys = new Set(availableModels.map((model) => modelKey(model.provider, model.id)));
    } catch (err) {
      if (!shouldFallbackToAuthHeuristics(err)) throw err;
      availableKeys = void 0;
      if (!availabilityErrorMessage) availabilityErrorMessage = formatErrorWithStack(err);
    }
  return {
    registry,
    models,
    availableKeys,
    availabilityErrorMessage,
  };
}
//#endregion
//#region src/commands/models/list.registry-load.ts
/** Registry-loading adapters for model-list row construction. */
/** Loads the full model registry and tracks discovered provider/model keys. */
async function loadListModelRegistry(cfg, opts) {
  const loaded = await loadModelRegistry(cfg, opts);
  return {
    ...loaded,
    discoveredKeys: new Set(loaded.models.map((model) => modelKey(model.provider, model.id))),
  };
}
function findConfiguredRegistryModel(params) {
  const model = params.registry.find(params.entry.ref.provider, params.entry.ref.model);
  if (!model) return;
  if (
    shouldSuppressBuiltInModel({
      provider: model.provider,
      id: model.id,
      baseUrl: model.baseUrl,
      config: params.cfg,
    })
  )
    return;
  return model;
}
/** Loads only configured registry entries and their auth availability. */
function loadConfiguredListModelRegistry(cfg, entries, opts) {
  const { registry } = loadAgentModelRegistry(cfg, {
    workspaceDir: opts?.workspaceDir,
    providerFilter: opts?.providerFilter,
  });
  const discoveredKeys = /* @__PURE__ */ new Set();
  const availableKeys = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    const model = findConfiguredRegistryModel({
      registry,
      entry,
      cfg,
    });
    if (!model) continue;
    const key = modelKey(model.provider, model.id);
    discoveredKeys.add(key);
    if (registry.hasConfiguredAuth(model)) availableKeys.add(key);
  }
  return {
    registry,
    discoveredKeys,
    availableKeys,
  };
}
//#endregion
export { loadConfiguredListModelRegistry, loadListModelRegistry };
