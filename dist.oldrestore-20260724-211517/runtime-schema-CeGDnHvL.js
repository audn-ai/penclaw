import "./agent-scope-y9xQv_q1.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  O as collectChannelSchemaMetadata,
  i as getRuntimeConfig,
  k as collectPluginSchemaMetadata,
  u as readConfigFileSnapshot,
} from "./io-B3ne6NxF.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import "./config-BDv-QbJ6.js";
import { t as buildConfigSchema } from "./schema-vH3gOrCC.js";
//#region src/config/runtime-schema.ts
function loadManifestRegistry(config, env) {
  const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
  return resolvePluginMetadataSnapshot({
    config,
    env: env ?? process.env,
    workspaceDir,
    allowWorkspaceScopedCurrent: true,
  }).manifestRegistry;
}
/** Builds the config schema from the active runtime config and plugin metadata. */
function loadGatewayRuntimeConfigSchema() {
  const registry = loadManifestRegistry(getRuntimeConfig());
  return buildConfigSchema({
    plugins: collectPluginSchemaMetadata(registry),
    channels: collectChannelSchemaMetadata(registry),
  });
}
async function readBestEffortRuntimeConfigSchema() {
  const snapshot = await readConfigFileSnapshot();
  const registry = loadManifestRegistry(
    snapshot.valid ? snapshot.config : { plugins: { enabled: true } },
  );
  return buildConfigSchema({
    plugins: snapshot.valid ? collectPluginSchemaMetadata(registry) : [],
    channels: collectChannelSchemaMetadata(registry),
  });
}
//#endregion
export { readBestEffortRuntimeConfigSchema as n, loadGatewayRuntimeConfigSchema as t };
