import {
  d as readCodexPluginConfig,
  f as resolveCodexAppServerRuntimeOptions,
  v as resolveCodexSupervisionAppServerRuntimeOptions,
} from "./config-C1imjxk6.js";
import { t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-Dx0ZqdxR.js";
//#region extensions/codex/src/app-server/binding-connection.ts
/** Requires the native model pair after a supervised pending branch has materialized. */
function requireCodexSupervisionModelSelection(binding) {
  const model = binding.model?.trim();
  const modelProvider = binding.modelProvider?.trim();
  if (binding.connectionScope !== "supervision" || !model || !modelProvider)
    throw new Error(
      "Codex supervised binding is missing its native model and provider; refusing request selection",
    );
  return {
    model,
    modelProvider,
  };
}
/** Resolves connection and auth ownership exclusively from the private thread binding. */
function resolveCodexBindingAppServerConnection(params) {
  const { binding, authProfileId, ...runtimeParams } = params;
  const usesSupervisionConnection = binding?.connectionScope === "supervision";
  if (
    usesSupervisionConnection &&
    readCodexPluginConfig(runtimeParams.pluginConfig).supervision?.enabled !== true
  )
    throw new Error(
      "Codex supervision is disabled; refusing to open a native user-home supervised session",
    );
  const appServer = (
    usesSupervisionConnection
      ? resolveCodexSupervisionAppServerRuntimeOptions
      : resolveCodexAppServerRuntimeOptions
  )(runtimeParams);
  if (usesSupervisionConnection) {
    const persistedFingerprint =
      binding.pendingSupervisionBranch?.connectionFingerprint ??
      binding.appServerRuntimeFingerprint;
    const currentFingerprint = buildCodexAppServerConnectionFingerprint(
      appServer,
      runtimeParams.agentDir,
    );
    if (!persistedFingerprint || persistedFingerprint !== currentFingerprint)
      throw new Error(
        "Codex supervision connection changed; refusing to operate on its bound native thread",
      );
  }
  return {
    appServer,
    usesSupervisionConnection,
    requestAuthProfileId: usesSupervisionConnection ? void 0 : authProfileId,
    clientAuthProfileId: usesSupervisionConnection ? null : authProfileId,
  };
}
//#endregion
export { resolveCodexBindingAppServerConnection as n, requireCodexSupervisionModelSelection as t };
