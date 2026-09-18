import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-lI-0JTS4.js";
import { t as resolvePluginConfigContractsById } from "./config-contracts-B2_LoKnh.js";
import "./agent-scope-y9xQv_q1.js";
import { c as normalizePluginsConfig, d as resolveEnableState } from "./config-state-C1Qyxaws.js";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as collectSecretInputAssignment } from "./runtime-shared-CE1Ki5Mc.js";
import "./shared-CrrsbqCi.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/secrets/runtime-config-collectors-plugins.ts
/** Collects plugin config secret refs from runtime plugin metadata. */
function parsePluginConfigArrayIndex(segment) {
  return parseConfigPathArrayIndex(segment);
}
/**
 * Walk manifest-declared plugin config SecretRef surfaces and collect
 * assignments for runtime materialization. Plugin-owned metadata controls which
 * config paths support SecretRefs and whether bundled plugins stay inactive on
 * that surface until explicitly enabled.
 *
 * When `loadablePluginOrigins` is provided, entries whose ID is not in the map
 * are treated as inactive (stale config entries for plugins that are no longer
 * installed). This prevents resolution failures for SecretRefs belonging to
 * non-loadable plugins from blocking startup or preflight validation.
 */
/** Collects SecretRef assignments from plugin-owned config contract paths. */
function collectPluginConfigAssignments(params) {
  const entries = params.config.plugins?.entries;
  if (!isRecord(entries)) return;
  const normalizedConfig = normalizePluginsConfig(params.config.plugins);
  const workspaceDir = resolveAgentWorkspaceDir(
    params.config,
    resolveDefaultAgentId(params.config),
  );
  const bundledLoadablePluginIds = [...(params.loadablePluginOrigins?.entries() ?? [])]
    .filter(([, origin]) => origin === "bundled")
    .map(([pluginId]) => pluginId);
  const pluginSecretInputs = new Map(
    [
      ...resolvePluginConfigContractsById({
        config: params.config,
        workspaceDir,
        env: params.context.env,
        fallbackToBundledMetadata: true,
        fallbackToBundledMetadataForResolvedBundled: true,
        fallbackBundledPluginIds: bundledLoadablePluginIds,
        pluginIds: Object.keys(entries),
      }).entries(),
    ].flatMap(([pluginId, metadata]) => {
      const secretInputs = metadata.configContracts.secretInputs;
      if (!secretInputs?.paths.length) return [];
      return [
        [
          pluginId,
          {
            origin: metadata.origin,
            bundledDefaultEnabled: secretInputs.bundledDefaultEnabled,
            paths: secretInputs.paths,
          },
        ],
      ];
    }),
  );
  for (const [pluginId, entry] of Object.entries(entries)) {
    const secretInputs = pluginSecretInputs.get(pluginId);
    if (!secretInputs) continue;
    if (!isRecord(entry)) continue;
    const pluginConfig = entry.config;
    if (!isRecord(pluginConfig)) continue;
    const pluginOrigin = params.loadablePluginOrigins?.get(pluginId);
    if (params.loadablePluginOrigins && !pluginOrigin) {
      collectConfiguredPluginSecretAssignments({
        pluginId,
        pluginConfig,
        secretPaths: secretInputs.paths,
        active: false,
        inactiveReason: "plugin is not loadable (stale config entry).",
        defaults: params.defaults,
        context: params.context,
      });
      continue;
    }
    const resolvedOrigin = pluginOrigin ?? secretInputs.origin;
    const enableState = resolveEnableState(
      pluginId,
      resolvedOrigin,
      normalizedConfig,
      resolvedOrigin === "bundled" ? secretInputs.bundledDefaultEnabled : void 0,
    );
    collectConfiguredPluginSecretAssignments({
      pluginId,
      pluginConfig,
      secretPaths: secretInputs.paths,
      active: enableState.enabled,
      inactiveReason: enableState.reason ?? "plugin is disabled.",
      defaults: params.defaults,
      context: params.context,
    });
  }
}
function collectConfiguredPluginSecretAssignments(params) {
  const seenPaths = /* @__PURE__ */ new Set();
  for (const secretPath of params.secretPaths)
    for (const match of collectPluginConfigContractMatches({
      root: params.pluginConfig,
      pathPattern: secretPath.path,
    })) {
      const fullPath = `plugins.entries.${params.pluginId}.config.${match.path}`;
      if (seenPaths.has(fullPath)) continue;
      seenPaths.add(fullPath);
      collectSecretInputAssignment({
        value: match.value,
        path: fullPath,
        expected: secretPath.expected ?? "string",
        defaults: params.defaults,
        context: params.context,
        active: params.active,
        inactiveReason: `plugin "${params.pluginId}": ${params.inactiveReason}`,
        apply: createPluginConfigAssignmentApply(params.pluginConfig, match.path),
      });
    }
}
function createPluginConfigAssignmentApply(pluginConfig, relativePath) {
  return (value) => {
    const segments = normalizeStringEntries(relativePath.replace(/\[(\d+)\]/g, ".$1").split("."));
    if (segments.length === 0) return;
    let current = pluginConfig;
    for (const segment of segments.slice(0, -1)) {
      if (Array.isArray(current)) {
        const index = parsePluginConfigArrayIndex(segment);
        current = index !== void 0 && index < current.length ? current[index] : void 0;
        continue;
      }
      current = isRecord(current) ? current[segment] : void 0;
    }
    const finalSegment = segments.at(-1);
    if (!finalSegment) return;
    if (Array.isArray(current)) {
      const index = parsePluginConfigArrayIndex(finalSegment);
      if (index !== void 0 && index < current.length) current[index] = value;
      return;
    }
    if (isRecord(current)) current[finalSegment] = value;
  };
}
//#endregion
export { collectPluginConfigAssignments as t };
