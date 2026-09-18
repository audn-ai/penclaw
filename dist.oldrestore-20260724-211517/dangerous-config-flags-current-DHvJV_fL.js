import { t as collectPluginConfigContractMatches } from "./config-contract-matches-lI-0JTS4.js";
import "./utils-DtcDeqWS.js";
import { t as DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS } from "./config-l1rpbjvM.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/security/core-dangerous-config-flags.ts
/** List enabled core config flags that intentionally weaken security posture. */
function collectCoreInsecureOrDangerousFlags(cfg) {
  const enabledFlags = [];
  if (cfg.gateway?.controlUi?.allowInsecureAuth === true)
    enabledFlags.push("gateway.controlUi.allowInsecureAuth=true");
  if (cfg.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback === true)
    enabledFlags.push("gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true");
  if (cfg.gateway?.controlUi?.dangerouslyDisableDeviceAuth === true)
    enabledFlags.push("gateway.controlUi.dangerouslyDisableDeviceAuth=true");
  if (cfg.hooks?.gmail?.allowUnsafeExternalContent === true)
    enabledFlags.push("hooks.gmail.allowUnsafeExternalContent=true");
  if (Array.isArray(cfg.hooks?.mappings)) {
    for (const [index, mapping] of cfg.hooks.mappings.entries())
      if (mapping?.allowUnsafeExternalContent === true)
        enabledFlags.push(`hooks.mappings[${index}].allowUnsafeExternalContent=true`);
  }
  if (cfg.tools?.exec?.applyPatch?.workspaceOnly === false)
    enabledFlags.push("tools.exec.applyPatch.workspaceOnly=false");
  const auditSuppressionCount = cfg.security?.audit?.suppressions?.length ?? 0;
  if (auditSuppressionCount > 0)
    enabledFlags.push(`security.audit.suppressions configured (${auditSuppressionCount})`);
  return enabledFlags;
}
//#endregion
//#region src/security/dangerous-config-flags-core.ts
function formatDangerousConfigFlagValue(value) {
  return value === null ? "null" : String(value);
}
function getAgentDangerousFlagPathSegment(agent, index) {
  const id =
    agent &&
    typeof agent === "object" &&
    !Array.isArray(agent) &&
    typeof agent.id === "string" &&
    agent.id.length > 0
      ? agent.id
      : void 0;
  return id ? `agents.list[id=${JSON.stringify(id)}]` : `agents.list[${index}]`;
}
function collectExactPluginConfigContractMatches({ pathPattern, root }) {
  return Object.hasOwn(root, pathPattern)
    ? [
        {
          path: pathPattern,
          value: root[pathPattern],
        },
      ]
    : [];
}
/**
 * Return every enabled dangerous flag from core config plus plugin config contracts.
 * The returned strings are stable audit/report labels, not user-edited config paths.
 */
function collectEnabledInsecureOrDangerousFlagsFromContracts(cfg, inputs = {}) {
  const enabledFlags = collectCoreInsecureOrDangerousFlags(cfg);
  const collectSandboxDockerDangerousFlags = (docker, pathPrefix) => {
    if (!isRecord(docker)) return;
    for (const key of DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS)
      if (docker[key] === true) enabledFlags.push(`${pathPrefix}.${key}=true`);
  };
  if (cfg.hooks?.allowRequestSessionKey === true)
    enabledFlags.push("hooks.allowRequestSessionKey=true");
  if (cfg.browser?.ssrfPolicy?.dangerouslyAllowPrivateNetwork === true)
    enabledFlags.push("browser.ssrfPolicy.dangerouslyAllowPrivateNetwork=true");
  if (cfg.tools?.fs?.workspaceOnly === false) enabledFlags.push("tools.fs.workspaceOnly=false");
  collectSandboxDockerDangerousFlags(
    isRecord(cfg.agents?.defaults?.sandbox?.docker)
      ? cfg.agents?.defaults?.sandbox?.docker
      : void 0,
    "agents.defaults.sandbox.docker",
  );
  if (Array.isArray(cfg.agents?.list))
    for (const [index, agent] of cfg.agents.list.entries())
      collectSandboxDockerDangerousFlags(
        isRecord(agent?.sandbox?.docker) ? agent.sandbox.docker : void 0,
        `${getAgentDangerousFlagPathSegment(agent, index)}.sandbox.docker`,
      );
  const pluginEntries = cfg.plugins?.entries;
  if (!isRecord(pluginEntries)) return enabledFlags;
  const configContracts = inputs.configContractsById ?? /* @__PURE__ */ new Map();
  const collectPluginConfigContractMatches =
    inputs.collectPluginConfigContractMatches ?? collectExactPluginConfigContractMatches;
  const seenFlags = /* @__PURE__ */ new Set();
  for (const [pluginId, metadata] of configContracts.entries()) {
    const dangerousFlags = metadata.configContracts.dangerousFlags;
    if (!dangerousFlags?.length) continue;
    const pluginEntry = pluginEntries[pluginId];
    if (!isRecord(pluginEntry) || !isRecord(pluginEntry.config)) continue;
    for (const flag of dangerousFlags)
      for (const match of collectPluginConfigContractMatches({
        root: pluginEntry.config,
        pathPattern: flag.path,
      })) {
        if (!Object.is(match.value, flag.equals)) continue;
        const rendered = `plugins.entries.${pluginId}.config.${match.path}=${formatDangerousConfigFlagValue(flag.equals)}`;
        if (seenFlags.has(rendered)) continue;
        seenFlags.add(rendered);
        enabledFlags.push(rendered);
      }
  }
  return enabledFlags;
}
//#endregion
//#region src/security/dangerous-config-flags-current.ts
function resolveCurrentPluginConfigContractsById(params) {
  const snapshot = getCurrentPluginMetadataSnapshot({
    config: params.cfg,
    env: process.env,
    allowWorkspaceScopedSnapshot: true,
  });
  if (!snapshot) return;
  const contractsById = /* @__PURE__ */ new Map();
  for (const pluginId of params.pluginIds) {
    const normalizedPluginId = snapshot.normalizePluginId(pluginId);
    const plugin = snapshot.byPluginId.get(pluginId) ?? snapshot.byPluginId.get(normalizedPluginId);
    if (!plugin) return;
    if (!plugin.configContracts) continue;
    contractsById.set(pluginId, {
      origin: plugin.origin,
      configContracts: plugin.configContracts,
    });
  }
  return contractsById;
}
/**
 * Collect dangerous flags using the gateway's current plugin metadata snapshot when it is complete.
 * Returns undefined when any configured plugin is missing so callers can use manifest discovery.
 */
function collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(cfg) {
  const pluginEntries = cfg.plugins?.entries;
  if (!isRecord(pluginEntries)) return collectEnabledInsecureOrDangerousFlagsFromContracts(cfg);
  const configContracts = resolveCurrentPluginConfigContractsById({
    cfg,
    pluginIds: Object.keys(pluginEntries),
  });
  if (!configContracts) return;
  return collectEnabledInsecureOrDangerousFlagsFromContracts(cfg, {
    collectPluginConfigContractMatches,
    configContractsById: configContracts,
  });
}
//#endregion
export {
  collectEnabledInsecureOrDangerousFlagsFromContracts as n,
  collectCoreInsecureOrDangerousFlags as r,
  collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot as t,
};
