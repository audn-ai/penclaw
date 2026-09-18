import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Cto61spH.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/agents/models-config-state.d.ts
type ModelsJsonReadyResult = {
  agentDir: string;
  wrote: boolean;
};
//#endregion
//#region src/agents/models-config.d.ts
type EnsureOpenClawModelsJsonOptions = {
  pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "owners">;
  workspaceDir?: string;
  providerDiscoveryProviderIds?: readonly string[];
  providerDiscoveryTimeoutMs?: number;
  providerDiscoveryEntriesOnly?: boolean;
};
/** Best-effort chmod for generated models.json and plugin catalog files. */
/** Ensures models.json and plugin catalog sidecars are current for an agent. */
declare function ensureOpenClawModelsJson(
  config?: OpenClawConfig,
  agentDirOverride?: string,
  options?: EnsureOpenClawModelsJsonOptions,
): Promise<ModelsJsonReadyResult>;
//#endregion
export { ensureOpenClawModelsJson as t };
