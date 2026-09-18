import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-CQ0NgfBE.js";
import "./agent-scope-y9xQv_q1.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  i as isReusableCurrentPluginMetadataSnapshot,
  n as clearCurrentPluginMetadataSnapshot,
  o as setCurrentPluginMetadataSnapshot,
} from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { f as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-lBfkb-7L.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  n as fingerprintPluginAutoEnableConfig,
  r as fingerprintPluginAutoEnableEnv,
  t as applyPluginAutoEnable,
} from "./plugin-auto-enable-DAo0bjMj.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C3dWg4tn.js";
import "./config-BDv-QbJ6.js";
import {
  a as resolvePluginMetadataSnapshot,
  n as isPluginMetadataSnapshotCompatible,
} from "./plugin-metadata-snapshot-BMgImu0m.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import "./logging-C8NGWOYr.js";
//#region src/plugins/runtime/load-context.ts
const log = createSubsystemLogger("plugins");
let currentAutoEnableCache;
registerPluginMetadataProcessMemoLifecycleClear(() => {
  currentAutoEnableCache = void 0;
});
function samePluginIds(left, right) {
  return (
    left === right ||
    (left !== void 0 &&
      right !== void 0 &&
      left.length === right.length &&
      left.every((pluginId, index) => pluginId === right[index]))
  );
}
function applyCurrentPluginAutoEnable(params) {
  if (!params.snapshot || !params.manifestRegistry || params.env !== process.env)
    return applyPluginAutoEnable({
      config: params.config,
      env: params.env,
      manifestRegistry: params.manifestRegistry,
      discovery: params.snapshot?.discovery,
    });
  const workspaceDir = params.snapshot.workspaceDir ?? params.workspaceDir;
  const autoEnableConfigFingerprint = fingerprintPluginAutoEnableConfig(params.config);
  const autoEnableEnvFingerprint = fingerprintPluginAutoEnableEnv(params.env);
  const cached = currentAutoEnableCache;
  if (
    cached?.config === params.config &&
    cached.env === params.env &&
    cached.autoEnableConfigFingerprint === autoEnableConfigFingerprint &&
    cached.autoEnableEnvFingerprint === autoEnableEnvFingerprint &&
    cached.metadataConfigFingerprint === params.snapshot.configFingerprint &&
    cached.policyHash === params.snapshot.policyHash &&
    cached.workspaceDir === workspaceDir &&
    samePluginIds(cached.pluginIds, params.snapshot.pluginIds)
  )
    return cached.result;
  const result = applyPluginAutoEnable({
    config: params.config,
    env: params.env,
    manifestRegistry: params.manifestRegistry,
    discovery: params.snapshot.discovery,
  });
  currentAutoEnableCache = {
    config: params.config,
    env: params.env,
    autoEnableConfigFingerprint,
    autoEnableEnvFingerprint,
    metadataConfigFingerprint: params.snapshot.configFingerprint,
    pluginIds: params.snapshot.pluginIds,
    policyHash: params.snapshot.policyHash,
    result,
    workspaceDir,
  };
  return result;
}
/** Creates the default plugin runtime loader logger. */
function createPluginRuntimeLoaderLogger() {
  return {
    info: (message) => log.info(message),
    warn: (message) => log.warn(message),
    error: (message) => log.error(message),
    debug: (message) => log.debug(message),
  };
}
/** Resolves config, manifests, install records, and auto-enable state for runtime loads. */
function resolvePluginRuntimeLoadContext(options) {
  const env = options?.env ?? process.env;
  const rawConfig = options?.config ?? getRuntimeConfig();
  const rawWorkspaceDir =
    options?.workspaceDir ?? resolveAgentWorkspaceDir(rawConfig, resolveDefaultAgentId(rawConfig));
  const initialMetadataSnapshot =
    options?.manifestRegistry === void 0
      ? resolvePluginMetadataSnapshot({
          config: rawConfig,
          env,
          workspaceDir: rawWorkspaceDir,
          allowWorkspaceScopedCurrent: true,
        })
      : void 0;
  const manifestRegistry = options?.manifestRegistry ?? initialMetadataSnapshot?.manifestRegistry;
  const activationSourceConfig = resolvePluginActivationSourceConfig({
    config: rawConfig,
    activationSourceConfig: options?.activationSourceConfig,
  });
  const autoEnabled = applyCurrentPluginAutoEnable({
    config: rawConfig,
    env,
    workspaceDir: rawWorkspaceDir,
    manifestRegistry,
    snapshot: initialMetadataSnapshot,
  });
  const config = autoEnabled.config;
  const workspaceDir =
    options?.workspaceDir ?? resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
  const metadataSnapshot =
    options?.manifestRegistry !== void 0
      ? void 0
      : initialMetadataSnapshot &&
          isPluginMetadataSnapshotCompatible({
            snapshot: initialMetadataSnapshot,
            config,
            env,
            workspaceDir,
          })
        ? initialMetadataSnapshot
        : resolvePluginMetadataSnapshot({
            config,
            env,
            workspaceDir,
            allowWorkspaceScopedCurrent: true,
            ...(initialMetadataSnapshot ? { index: initialMetadataSnapshot.index } : {}),
          });
  const finalManifestRegistry = options?.manifestRegistry ?? metadataSnapshot?.manifestRegistry;
  const installRecords = metadataSnapshot
    ? extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index)
    : void 0;
  if (metadataSnapshot)
    if (isReusableCurrentPluginMetadataSnapshot(metadataSnapshot))
      setCurrentPluginMetadataSnapshot(metadataSnapshot, {
        config: rawConfig,
        compatibleConfigs: [config, activationSourceConfig],
        env,
        workspaceDir,
      });
    else clearCurrentPluginMetadataSnapshot();
  return {
    rawConfig,
    config,
    activationSourceConfig,
    autoEnabledReasons: autoEnabled.autoEnabledReasons,
    workspaceDir,
    env,
    logger: options?.logger ?? createPluginRuntimeLoaderLogger(),
    ...(finalManifestRegistry ? { manifestRegistry: finalManifestRegistry } : {}),
    installRecords,
  };
}
/** Builds plugin load options from a resolved runtime load context. */
function buildPluginRuntimeLoadOptions(context, overrides) {
  return buildPluginRuntimeLoadOptionsFromValues(context, overrides);
}
/** Builds plugin load options from explicit runtime load values. */
function buildPluginRuntimeLoadOptionsFromValues(values, overrides) {
  return {
    config: values.config,
    activationSourceConfig: values.activationSourceConfig,
    autoEnabledReasons: values.autoEnabledReasons,
    workspaceDir: values.workspaceDir,
    env: values.env,
    logger: values.logger,
    manifestRegistry: values.manifestRegistry,
    installRecords: values.installRecords,
    ...overrides,
  };
}
//#endregion
export {
  resolvePluginRuntimeLoadContext as i,
  buildPluginRuntimeLoadOptionsFromValues as n,
  createPluginRuntimeLoaderLogger as r,
  buildPluginRuntimeLoadOptions as t,
};
