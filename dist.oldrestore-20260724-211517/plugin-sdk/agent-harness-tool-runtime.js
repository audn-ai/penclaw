import {
  a as createCodeModeTools,
  i as applyCodeModeCatalog,
  o as resolveCodeModeConfig,
} from "../code-mode-BxoaB7Mu.js";
import {
  n as CODE_MODE_WAIT_TOOL_NAME,
  t as CODE_MODE_EXEC_TOOL_NAME,
} from "../code-mode-control-tools-B27uc_a6.js";
import { t as resolveConversationCapabilityProfile } from "../conversation-capability-profile-BibJNI2C.js";
import {
  T as resolveToolSearchConfig,
  _ as clearToolSearchCatalog,
  a as shouldCatalogToolForLocalModelLean,
  c as TOOL_SEARCH_CODE_MODE_TOOL_NAME,
  h as applyToolSearchCatalog,
  i as resolveLocalModelLeanPreserveToolNames,
  k as getActiveAgentRingZeroTools,
  l as TOOL_SEARCH_RAW_TOOL_NAME,
  m as applyToolSchemaDirectoryCatalog,
  n as filterLocalModelLeanTools,
  o as TOOL_CALL_RAW_TOOL_NAME,
  r as isLocalModelLeanEnabled,
  s as TOOL_DESCRIBE_RAW_TOOL_NAME,
  t as applyLocalModelLeanToolSearchDefaults,
  x as estimateToolSchemaDirectoryToolNames,
  y as createToolSearchCatalogRef,
} from "../local-model-lean-D3O2n_2v.js";
import { n as filterRuntimeCompatibleTools } from "../tool-schema-projection-ZrMdwk4s.js";
//#region src/agents/harness/tool-surface-bridge.ts
const TOOL_SEARCH_CONTROL_ALLOWLIST_NAMES = [
  TOOL_SEARCH_CODE_MODE_TOOL_NAME,
  TOOL_SEARCH_RAW_TOOL_NAME,
  TOOL_DESCRIBE_RAW_TOOL_NAME,
  TOOL_CALL_RAW_TOOL_NAME,
];
const CODE_MODE_CONTROL_ALLOWLIST_NAMES = [CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME];
function createAgentHarnessToolSurfaceRuntime(params) {
  const forceDirectMessageTool =
    params.forceMessageTool === true || params.sourceReplyDeliveryMode === "message_tool_only";
  const localModelLeanEnabled = isLocalModelLeanEnabled({
    config: params.config,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
  const codeModeConfig = resolveCodeModeConfig(params.config, params.agentId);
  const toolSearchRuntimeConfig = forceDirectMessageTool
    ? params.config
    : applyLocalModelLeanToolSearchDefaults({
        config: params.config,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
      });
  const toolSearchConfig = resolveToolSearchConfig(toolSearchRuntimeConfig);
  const toolsAvailable =
    params.modelToolsEnabled &&
    params.disableTools !== true &&
    params.isRawModelRun !== true &&
    params.toolsAllow?.length !== 0;
  const ringZeroToolRun = getActiveAgentRingZeroTools().length > 0;
  const codeModeControlsEnabled = toolsAvailable && !ringZeroToolRun && codeModeConfig.enabled;
  const toolSearchControlsEnabled =
    toolsAvailable && !ringZeroToolRun && !codeModeControlsEnabled && toolSearchConfig.enabled;
  const toolSearchCatalogRef =
    toolSearchControlsEnabled || codeModeControlsEnabled ? createToolSearchCatalogRef() : void 0;
  const runtimeToolAllowlist =
    (toolSearchControlsEnabled || codeModeControlsEnabled) && params.runtimeToolAllowlist
      ? [
          .../* @__PURE__ */ new Set([
            ...params.runtimeToolAllowlist,
            ...(toolSearchControlsEnabled ? TOOL_SEARCH_CONTROL_ALLOWLIST_NAMES : []),
            ...(codeModeControlsEnabled ? CODE_MODE_CONTROL_ALLOWLIST_NAMES : []),
          ]),
        ]
      : params.runtimeToolAllowlist
        ? [...params.runtimeToolAllowlist]
        : void 0;
  const toolSearchCatalogExecutor =
    toolSearchControlsEnabled || codeModeControlsEnabled ? params.executeTool : void 0;
  const preserveToolNames = resolveLocalModelLeanPreserveToolNames({
    toolNames: resolveConversationCapabilityProfile({
      config: params.config,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      modelProvider: params.modelProvider,
      modelId: params.modelId,
      runtimeToolAllowlist,
    }).policy.explicitToolOverrideAllowlist,
    forceMessageTool: params.forceMessageTool,
    sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
  });
  const compactTools = (tools, options = {}) => {
    let effectiveTools = [
      ...filterRuntimeCompatibleTools(
        options.localModelLeanApplied
          ? tools
          : filterLocalModelLeanTools({
              tools,
              config: params.config,
              agentId: params.agentId,
              sessionKey: params.sessionKey,
              preserveToolNames,
            }),
      ).tools,
    ];
    const codeModeTools = codeModeControlsEnabled
      ? createCodeModeTools({
          config: params.config,
          runtimeConfig: params.config,
          agentId: params.agentId,
          sessionKey: params.sessionKey,
          sessionId: params.sessionId,
          runId: params.runId,
          catalogRef: toolSearchCatalogRef,
          abortSignal: params.abortSignal,
          executeTool: params.executeTool,
        })
      : [];
    const directoryRequiredToolNames = forceDirectMessageTool ? ["message"] : [];
    const directoryHydratedToolNames =
      toolSearchControlsEnabled && toolSearchConfig.mode === "directory"
        ? (() => {
            try {
              return estimateToolSchemaDirectoryToolNames({
                tools: effectiveTools,
                query: params.prompt ?? "",
                maxTools: 4,
                requiredToolNames: directoryRequiredToolNames,
              });
            } catch {
              return directoryRequiredToolNames;
            }
          })()
        : [];
    const compacted = codeModeControlsEnabled
      ? applyCodeModeCatalog({
          tools: [...codeModeTools, ...effectiveTools],
          config: params.config,
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          agentId: params.agentId,
          runId: params.runId,
          catalogRef: toolSearchCatalogRef,
          toolHookContext: options.hookContext,
        })
      : toolSearchConfig.mode === "directory"
        ? applyToolSchemaDirectoryCatalog({
            tools: effectiveTools,
            config: toolSearchRuntimeConfig,
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            agentId: params.agentId,
            runId: params.runId,
            catalogRef: toolSearchCatalogRef,
            toolHookContext: options.hookContext,
            hydrateToolNames: directoryHydratedToolNames,
          })
        : applyToolSearchCatalog({
            tools: effectiveTools,
            config: toolSearchRuntimeConfig,
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            agentId: params.agentId,
            runId: params.runId,
            catalogRef: toolSearchCatalogRef,
            toolHookContext: options.hookContext,
            shouldCatalogTool:
              localModelLeanEnabled && toolSearchConfig.mode === "tools"
                ? shouldCatalogToolForLocalModelLean
                : void 0,
          });
    effectiveTools = [
      ...filterRuntimeCompatibleTools(
        options.localModelLeanApplied
          ? compacted.tools
          : filterLocalModelLeanTools({
              tools: compacted.tools,
              config: params.config,
              agentId: params.agentId,
              sessionKey: params.sessionKey,
              preserveToolNames,
            }),
      ).tools,
    ];
    return { tools: effectiveTools };
  };
  return {
    codeModeControlsEnabled,
    compactTools,
    config: toolSearchControlsEnabled ? toolSearchRuntimeConfig : params.config,
    includeToolSearchControls: toolSearchControlsEnabled,
    runtimeToolAllowlist,
    toolSearchCatalogRef,
    toolSearchControlsEnabled,
    cleanup: () => {
      clearToolSearchCatalog({
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
        agentId: params.agentId,
        runId: params.runId,
        catalogRef: toolSearchCatalogRef,
      });
    },
    toolSearchCatalogExecutor,
  };
}
//#endregion
export { createAgentHarnessToolSurfaceRuntime };
