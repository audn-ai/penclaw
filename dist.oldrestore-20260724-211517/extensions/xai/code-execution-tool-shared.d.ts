import { Type } from "typebox";
import { f as AgentToolResult } from "../../types-JQFrjdua.js";

//#region extensions/xai/code-execution-tool-shared.d.ts
declare function buildMissingCodeExecutionApiKeyPayload(): {
  error: string;
  message: string;
  docs: string;
};
declare function createCodeExecutionToolDefinition(
  execute: (toolCallId: string, args: Record<string, unknown>) => Promise<AgentToolResult<unknown>>,
): {
  label: string;
  name: string;
  description: string;
  parameters: Type.TObject<{
    task: Type.TString;
  }>;
  execute: (toolCallId: string, args: Record<string, unknown>) => Promise<AgentToolResult<unknown>>;
};
//#endregion
export { buildMissingCodeExecutionApiKeyPayload, createCodeExecutionToolDefinition };
