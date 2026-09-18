import {
  E as copyBeforeToolCallHookMarker,
  b as copyChannelAgentToolMeta,
  d as copyToolTerminalPresentation,
} from "./gateway-Dyh1k_4Q.js";
import { t as log } from "./logger-C5RMMskO.js";
import {
  _ as normalizeProviderToolSchemasWithPlugin,
  d as inspectProviderToolSchemasWithPlugin,
} from "./provider-runtime-DyIHJ2cX.js";
import { t as filterProviderNormalizableTools } from "./tool-schema-projection-ZrMdwk4s.js";
import { n as copyPluginToolMeta } from "./tools-K3NqAe9E.js";
//#region src/agents/embedded-agent-runner/tool-schema-runtime.ts
function buildProviderToolSchemaContext(params, provider) {
  return {
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    provider,
    modelId: params.modelId,
    modelApi: params.modelApi,
    model: params.model,
    tools: params.tools,
  };
}
/**
 * Runs provider-owned tool-schema normalization without encoding provider
 * families in the embedded runner.
 */
function normalizeProviderToolSchemas(params) {
  const provider = params.provider.trim();
  const pluginNormalized = normalizeProviderToolSchemasWithPlugin({
    provider,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    runtimeHandle: params.runtimeHandle,
    allowRuntimePluginLoad: params.allowRuntimePluginLoad,
    context: buildProviderToolSchemaContext(params, provider),
  });
  return Array.isArray(pluginNormalized) ? pluginNormalized : params.tools;
}
/**
 * Logs provider-owned tool-schema diagnostics after normalization.
 */
function logProviderToolSchemaDiagnostics(params) {
  const provider = params.provider.trim();
  const diagnostics = inspectProviderToolSchemasWithPlugin({
    provider,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    runtimeHandle: params.runtimeHandle,
    allowRuntimePluginLoad: params.allowRuntimePluginLoad,
    context: buildProviderToolSchemaContext(params, provider),
  });
  if (!Array.isArray(diagnostics)) return;
  if (diagnostics.length === 0) return;
  const summary = summarizeProviderToolSchemaDiagnostics(diagnostics);
  log.warn(
    `provider tool schema diagnostics: ${diagnostics.length} ${diagnostics.length === 1 ? "tool" : "tools"} for ${params.provider}: ${summary}`,
    {
      provider: params.provider,
      toolCount: params.tools.length,
      diagnosticCount: diagnostics.length,
      tools: params.tools.map((tool, index) => `${index}:${tool.name}`),
      diagnostics: diagnostics.map((diagnostic) => ({
        index: diagnostic.toolIndex,
        tool: diagnostic.toolName,
        violations: diagnostic.violations.slice(0, 12),
        violationCount: diagnostic.violations.length,
      })),
    },
  );
}
function summarizeProviderToolSchemaDiagnostics(diagnostics) {
  const visible = diagnostics.slice(0, 6).map((diagnostic) => {
    const violationCount = diagnostic.violations.length;
    return `${diagnostic.toolName || "unknown"} (${violationCount} ${violationCount === 1 ? "violation" : "violations"})`;
  });
  const remaining = diagnostics.length - visible.length;
  return remaining > 0 ? `${visible.join(", ")}, +${remaining} more` : visible.join(", ");
}
//#endregion
//#region src/agents/runtime-plan/tools.ts
/** Builds the provider/runtime context passed into runtime-plan tool hooks. */
function runtimePlanToolContext(params) {
  return {
    workspaceDir: params.workspaceDir,
    modelApi: params.modelApi ?? void 0,
    model: params.model,
  };
}
function copyRuntimeToolMetadata(source, target) {
  if (source === target) return;
  const catalogMode = source.catalogMode;
  if (catalogMode) target.catalogMode = catalogMode;
  copyPluginToolMeta(source, target);
  copyChannelAgentToolMeta(source, target);
  copyBeforeToolCallHookMarker(source, target);
  copyToolTerminalPresentation(source, target);
}
function preserveRuntimeToolMetadata(sourceTools, normalizedTools) {
  const sourcesByUniqueName = /* @__PURE__ */ new Map();
  const duplicateNames = /* @__PURE__ */ new Set();
  for (const source of sourceTools) {
    const name = source.name;
    if (sourcesByUniqueName.has(name)) {
      duplicateNames.add(name);
      sourcesByUniqueName.delete(name);
      continue;
    }
    if (!duplicateNames.has(name)) sourcesByUniqueName.set(name, source);
  }
  for (const [index, target] of normalizedTools.entries()) {
    const indexedSource = sourceTools[index];
    const source =
      indexedSource?.name === target.name ? indexedSource : sourcesByUniqueName.get(target.name);
    if (source) copyRuntimeToolMetadata(source, target);
  }
  return normalizedTools;
}
/** Normalizes tool schemas through a runtime plan or provider fallback policy. */
function normalizeAgentRuntimeTools(params) {
  const planContext = runtimePlanToolContext(params);
  const normalizableToolProjection = filterProviderNormalizableTools(params.tools);
  params.onPreNormalizationSchemaDiagnostics?.(
    normalizableToolProjection.diagnostics,
    params.tools,
  );
  const normalizableTools = [...normalizableToolProjection.tools];
  const normalized =
    params.runtimePlan?.tools.normalize(normalizableTools, planContext) ??
    normalizeProviderToolSchemas({
      tools: normalizableTools,
      provider: params.provider,
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env ?? process.env,
      modelId: params.modelId,
      modelApi: params.modelApi,
      model: params.model,
      runtimeHandle: params.runtimeHandle,
      allowRuntimePluginLoad: params.allowProviderRuntimePluginLoad,
    });
  return preserveRuntimeToolMetadata(
    normalizableTools,
    Array.isArray(normalized) ? normalized : normalizableTools,
  );
}
/** Emits runtime-plan or provider fallback diagnostics for normalized tools. */
function logAgentRuntimeToolDiagnostics(params) {
  const planContext = runtimePlanToolContext(params);
  if (params.runtimePlan) {
    params.runtimePlan.tools.logDiagnostics(params.tools, planContext);
    return;
  }
  logProviderToolSchemaDiagnostics({
    tools: params.tools,
    provider: params.provider,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env ?? process.env,
    modelId: params.modelId,
    modelApi: params.modelApi,
    model: params.model,
    runtimeHandle: params.runtimeHandle,
  });
}
//#endregion
export {
  normalizeProviderToolSchemas as i,
  normalizeAgentRuntimeTools as n,
  logProviderToolSchemaDiagnostics as r,
  logAgentRuntimeToolDiagnostics as t,
};
