import { x as getChannelAgentToolMeta } from "./gateway-Dyh1k_4Q.js";
import { c as getActivePluginRegistry } from "./runtime-CcYnX0B4.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { n as summarizeToolDescriptionText } from "./tool-description-summary-JT0jkN3-.js";
import { r as resolveToolDisplay } from "./tool-display-D6v1e5bQ.js";
import {
  n as filterRuntimeCompatibleTools,
  t as filterProviderNormalizableTools,
} from "./tool-schema-projection-ZrMdwk4s.js";
import { i as getPluginToolMeta, t as buildPluginToolMetadataKey } from "./tools-K3NqAe9E.js";
import { n as normalizeAgentRuntimeTools } from "./tools-M6Rtal9l.js";
//#region src/agents/tools-effective-inventory-shared.ts
function resolveEffectiveToolLabel(tool) {
  const rawLabel = normalizeOptionalString(tool.label) ?? "";
  if (
    rawLabel &&
    normalizeLowercaseStringOrEmpty(rawLabel) !== normalizeLowercaseStringOrEmpty(tool.name)
  )
    return rawLabel;
  return resolveToolDisplay({ name: tool.name }).title;
}
function resolveEffectiveToolRawDescription(tool) {
  return normalizeOptionalString(tool.description) ?? "";
}
function summarizeEffectiveToolDescription(tool) {
  return summarizeToolDescriptionText({
    rawDescription: resolveEffectiveToolRawDescription(tool),
    displaySummary: tool.displaySummary,
  });
}
function disambiguateEffectiveToolLabels(entries, resolveSuffix) {
  const counts = /* @__PURE__ */ new Map();
  for (const entry of entries) counts.set(entry.label, (counts.get(entry.label) ?? 0) + 1);
  return entries.map((entry) => {
    if ((counts.get(entry.label) ?? 0) < 2) return entry;
    return {
      ...entry,
      label: `${entry.label} (${resolveSuffix(entry)})`,
    };
  });
}
//#endregion
//#region src/agents/tools-effective-inventory-build.ts
/**
 * Builds the operator-facing effective inventory for the current tool surface:
 * runtime-compatible tools plus warnings for tools quarantined by schema
 * policy, with plugin/channel ownership preserved.
 */
function resolveEffectiveToolSource(tool, fallbackTool) {
  const pluginMeta =
    getPluginToolMeta(tool) ?? (fallbackTool ? getPluginToolMeta(fallbackTool) : void 0);
  if (pluginMeta) {
    if (pluginMeta.mcp || pluginMeta.pluginId === "bundle-mcp")
      return {
        source: "mcp",
        pluginId: pluginMeta.pluginId,
      };
    return {
      source: "plugin",
      pluginId: pluginMeta.pluginId,
    };
  }
  const channelMeta =
    getChannelAgentToolMeta(tool) ??
    (fallbackTool ? getChannelAgentToolMeta(fallbackTool) : void 0);
  if (channelMeta)
    return {
      source: "channel",
      channelId: channelMeta.channelId,
    };
  return { source: "core" };
}
function buildUnsupportedToolSchemaNotice(params) {
  const sourceTool = params.tool ?? params.fallbackTool;
  const source = sourceTool
    ? resolveEffectiveToolSource(sourceTool, params.fallbackTool)
    : { source: "core" };
  const owner =
    source.source === "plugin" && source.pluginId
      ? ` from plugin "${source.pluginId}"`
      : source.source === "channel" && source.channelId
        ? ` from channel "${source.channelId}"`
        : "";
  return {
    id: `unsupported-tool-schema:${params.diagnostic.toolName}`,
    severity: "warning",
    message: `Tool "${params.diagnostic.toolName}"${owner} has an unsupported runtime input schema (${params.diagnostic.violations.join(", ")}) and was quarantined before model projection. Fix or disable the owner, or remove the tool from active allowlists.`,
  };
}
function buildUnsupportedToolSchemaNotices(params) {
  return params.diagnostics.map((diagnostic) =>
    buildUnsupportedToolSchemaNotice({
      diagnostic,
      tool: readMatchingTool(params.tools, diagnostic),
      fallbackTool: params.rawToolsByName.get(diagnostic.toolName),
    }),
  );
}
function readMatchingTool(tools, diagnostic) {
  try {
    const tool = tools[diagnostic.toolIndex];
    return tool?.name === diagnostic.toolName ? tool : void 0;
  } catch {
    return;
  }
}
function buildReadableToolsByName(tools) {
  const toolsByName = /* @__PURE__ */ new Map();
  let toolCount;
  try {
    toolCount = tools.length;
  } catch {
    return toolsByName;
  }
  for (let index = 0; index < toolCount; index += 1)
    try {
      const tool = tools.at(index);
      if (tool) toolsByName.set(tool.name, tool);
    } catch {}
  return toolsByName;
}
/** Builds effective inventory entries from already runtime-compatible tools. */
function buildEffectiveToolInventoryEntries(tools, rawToolsByName = /* @__PURE__ */ new Map()) {
  const pluginToolMetadata = new Map(
    (getActivePluginRegistry()?.toolMetadata ?? []).map((entry) => [
      buildPluginToolMetadataKey(entry.pluginId, entry.metadata.toolName),
      entry.metadata,
    ]),
  );
  return disambiguateEffectiveToolLabels(
    tools
      .map((tool) => {
        const source = resolveEffectiveToolSource(tool, rawToolsByName.get(tool.name));
        const metadata = source.pluginId
          ? pluginToolMetadata.get(buildPluginToolMetadataKey(source.pluginId, tool.name))
          : void 0;
        return Object.assign(
          {
            id: tool.name,
            label:
              normalizeOptionalString(metadata?.displayName) ?? resolveEffectiveToolLabel(tool),
            description:
              normalizeOptionalString(metadata?.description) ??
              summarizeEffectiveToolDescription(tool),
            rawDescription:
              normalizeOptionalString(metadata?.description) ??
              resolveEffectiveToolRawDescription(tool) ??
              summarizeEffectiveToolDescription(tool),
            ...(metadata?.risk ? { risk: metadata.risk } : {}),
            ...(metadata?.tags ? { tags: metadata.tags } : {}),
          },
          source,
        );
      })
      .toSorted((a, b) => a.label.localeCompare(b.label)),
    (entry) => entry.pluginId ?? entry.channelId ?? entry.id,
  );
}
/** Normalizes tools, quarantines incompatible schemas, and returns inventory output. */
function buildRuntimeCompatibleToolInventory(params) {
  const rawToolsByName = buildReadableToolsByName(params.tools);
  const preNormalizationProjection = filterProviderNormalizableTools(params.tools);
  const preNormalizationDiagnostics = [...preNormalizationProjection.diagnostics];
  const normalizedTools = normalizeAgentRuntimeTools({
    tools: [...preNormalizationProjection.tools],
    provider: params.modelProvider ?? "",
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    modelId: params.modelId,
    modelApi: params.modelApi ?? void 0,
    model: params.runtimeModel,
    onPreNormalizationSchemaDiagnostics: (diagnostics) =>
      preNormalizationDiagnostics.push(...diagnostics),
  });
  const projection = filterRuntimeCompatibleTools(normalizedTools);
  const diagnostics = [...preNormalizationDiagnostics, ...projection.diagnostics];
  return {
    entries: buildEffectiveToolInventoryEntries(projection.tools, rawToolsByName),
    notices: buildUnsupportedToolSchemaNotices({
      diagnostics,
      tools: normalizedTools,
      rawToolsByName,
    }),
  };
}
//#endregion
export {
  resolveEffectiveToolRawDescription as a,
  resolveEffectiveToolLabel as i,
  buildRuntimeCompatibleToolInventory as n,
  summarizeEffectiveToolDescription as o,
  disambiguateEffectiveToolLabels as r,
  buildReadableToolsByName as t,
};
