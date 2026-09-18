import { r as AnyAgentTool } from "../common-CuQ9SS3Z.js";
import {
  n as ToolSearchCatalogToolExecutor,
  t as ToolSearchCatalogRef,
} from "../tool-search-D3CNzovA.js";
import { ho as HookContext } from "../types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/agents/harness/tool-surface-bridge.d.ts
type AgentHarnessToolSurfaceRuntime = {
  codeModeControlsEnabled: boolean;
  compactTools: (
    tools: AnyAgentTool[],
    options?: {
      hookContext?: HookContext;
      localModelLeanApplied?: boolean;
    },
  ) => {
    tools: AnyAgentTool[];
  };
  config: OpenClawConfig | undefined;
  includeToolSearchControls: boolean;
  runtimeToolAllowlist: string[] | undefined;
  toolSearchCatalogRef: ToolSearchCatalogRef | undefined;
  toolSearchControlsEnabled: boolean;
  cleanup: () => void;
  toolSearchCatalogExecutor: ToolSearchCatalogToolExecutor | undefined;
};
declare function createAgentHarnessToolSurfaceRuntime(params: {
  abortSignal?: AbortSignal;
  agentId?: string;
  config?: OpenClawConfig;
  disableTools?: boolean;
  executeTool: ToolSearchCatalogToolExecutor;
  forceMessageTool?: boolean;
  isRawModelRun?: boolean;
  modelId?: string;
  modelProvider?: string;
  modelToolsEnabled: boolean;
  prompt?: string;
  runId?: string;
  runtimeToolAllowlist?: readonly string[];
  sessionId?: string;
  sessionKey?: string;
  sourceReplyDeliveryMode?: string;
  toolsAllow?: readonly string[];
}): AgentHarnessToolSurfaceRuntime;
//#endregion
export { type AgentHarnessToolSurfaceRuntime, createAgentHarnessToolSurfaceRuntime };
