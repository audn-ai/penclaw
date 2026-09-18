import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DmSKVSKI.js";
import "./agent-scope-y9xQv_q1.js";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { c as getActivePluginRegistry } from "./runtime-CcYnX0B4.js";
import { Ai as validateToolsCatalogParams } from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  i as listCoreToolSections,
  n as PROFILE_OPTIONS,
  o as resolveCoreToolProfiles,
} from "./tool-catalog-fgOwzAUV.js";
import { n as summarizeToolDescriptionText } from "./tool-description-summary-JT0jkN3-.js";
import {
  a as resolvePluginTools,
  i as getPluginToolMeta,
  r as ensureStandalonePluginToolRegistryLoaded,
  t as buildPluginToolMetadataKey,
} from "./tools-K3NqAe9E.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/tools-catalog.ts
function buildCoreGroups() {
  return listCoreToolSections().map((section) => ({
    id: section.id,
    label: section.label,
    source: "core",
    tools: section.tools.map((tool) => ({
      id: tool.id,
      label: tool.label,
      description: tool.description,
      source: "core",
      defaultProfiles: resolveCoreToolProfiles(tool.id),
    })),
  }));
}
function buildPluginGroups(params) {
  const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
  const agentDir = resolveAgentDir(params.cfg, params.agentId);
  const toolContext = {
    config: params.cfg,
    workspaceDir,
    agentDir,
    agentId: params.agentId,
  };
  const toolRegistry = ensureStandalonePluginToolRegistryLoaded({
    context: toolContext,
    toolAllowlist: ["group:plugins"],
    allowGatewaySubagentBinding: true,
  });
  const pluginTools = resolvePluginTools({
    context: toolContext,
    existingToolNames: params.existingToolNames,
    toolAllowlist: ["group:plugins"],
    suppressNameConflicts: true,
    allowGatewaySubagentBinding: true,
    runtimeRegistry: toolRegistry,
  });
  const catalogRegistry = toolRegistry ?? getActivePluginRegistry();
  const groups = /* @__PURE__ */ new Map();
  const pluginToolMetadata = /* @__PURE__ */ new Map();
  if (catalogRegistry)
    for (const entry of catalogRegistry.toolMetadata) {
      const metadataKey = buildPluginToolMetadataKey(entry.pluginId, entry.metadata.toolName);
      pluginToolMetadata.set(metadataKey, entry.metadata);
    }
  const seenToolIds = /* @__PURE__ */ new Set();
  for (const tool of pluginTools) {
    const meta = getPluginToolMeta(tool);
    const pluginId = meta?.pluginId ?? "plugin";
    const groupId = `plugin:${pluginId}`;
    const existing = groups.get(groupId) ?? {
      id: groupId,
      label: pluginId,
      source: "plugin",
      pluginId,
      tools: [],
    };
    const ownedMetadata = meta?.pluginId
      ? pluginToolMetadata.get(buildPluginToolMetadataKey(meta.pluginId, tool.name))
      : void 0;
    existing.tools.push({
      id: tool.name,
      label:
        normalizeOptionalString(ownedMetadata?.displayName) ??
        normalizeOptionalString(tool.label) ??
        tool.name,
      description: summarizeToolDescriptionText({
        rawDescription:
          ownedMetadata?.description ??
          (typeof tool.description === "string" ? tool.description : void 0),
        displaySummary: tool.displaySummary,
      }),
      source: "plugin",
      pluginId,
      optional: meta?.optional,
      risk: ownedMetadata?.risk,
      tags: ownedMetadata?.tags,
      defaultProfiles: [],
    });
    seenToolIds.add(tool.name);
    groups.set(groupId, existing);
  }
  for (const entry of catalogRegistry?.tools ?? []) {
    const names = entry.names.length > 0 ? entry.names : (entry.declaredNames ?? []);
    for (const name of names) {
      if (seenToolIds.has(name) || params.existingToolNames.has(name)) continue;
      const groupId = `plugin:${entry.pluginId}`;
      const existing = groups.get(groupId) ?? {
        id: groupId,
        label: entry.pluginName ?? entry.pluginId,
        source: "plugin",
        pluginId: entry.pluginId,
        tools: [],
      };
      const ownedMetadata = pluginToolMetadata.get(
        buildPluginToolMetadataKey(entry.pluginId, name),
      );
      existing.tools.push({
        id: name,
        label: normalizeOptionalString(ownedMetadata?.displayName) ?? name,
        description:
          summarizeToolDescriptionText({ rawDescription: ownedMetadata?.description }) ||
          `Plugin tool from ${entry.pluginName ?? entry.pluginId}`,
        source: "plugin",
        pluginId: entry.pluginId,
        optional: entry.optional,
        risk: ownedMetadata?.risk,
        tags: ownedMetadata?.tags,
        defaultProfiles: [],
      });
      seenToolIds.add(name);
      groups.set(groupId, existing);
    }
  }
  return [...groups.values()]
    .map((group) =>
      Object.assign({}, group, { tools: group.tools.toSorted((a, b) => a.id.localeCompare(b.id)) }),
    )
    .toSorted((a, b) => a.label.localeCompare(b.label));
}
/** Build the merged core/plugin tool catalog for one agent. */
function buildToolsCatalogResult(params) {
  const agentId = normalizeOptionalString(params.agentId) || resolveDefaultAgentId(params.cfg);
  const includePlugins = params.includePlugins !== false;
  const groups = buildCoreGroups();
  if (includePlugins) {
    const existingToolNames = new Set(
      groups.flatMap((group) => group.tools.map((tool) => tool.id)),
    );
    groups.push(
      ...buildPluginGroups({
        cfg: params.cfg,
        agentId,
        existingToolNames,
      }),
    );
  }
  return {
    agentId,
    profiles: PROFILE_OPTIONS.map((profile) => ({
      id: profile.id,
      label: profile.label,
    })),
    groups,
  };
}
/** Gateway request handlers for tool catalog queries. */
const toolsCatalogHandlers = {
  "tools.catalog": ({ params, respond, context }) => {
    if (!validateToolsCatalogParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid tools.catalog params: ${formatValidationErrors(validateToolsCatalogParams.errors)}`,
        ),
      );
      return;
    }
    const resolved = resolveAgentIdOrRespondError({
      rawAgentId: params.agentId,
      respond,
      cfg: context.getRuntimeConfig(),
      normalize: normalizeOptionalString,
    });
    if (!resolved) return;
    respond(
      true,
      buildToolsCatalogResult({
        cfg: resolved.cfg,
        agentId: resolved.agentId,
        includePlugins: params.includePlugins,
      }),
      void 0,
    );
  },
};
//#endregion
export { toolsCatalogHandlers };
