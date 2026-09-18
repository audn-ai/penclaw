import { Type } from "typebox";
import { f as AgentToolResult } from "../../types-JQFrjdua.js";

//#region extensions/xai/x-search-tool-shared.d.ts
declare const X_SEARCH_HANDLE_LIMIT = 20;
declare function buildMissingXSearchApiKeyPayload(): {
  error: string;
  message: string;
  docs: string;
};
declare function createXSearchToolDefinition(
  execute: (toolCallId: string, args: Record<string, unknown>) => Promise<AgentToolResult<unknown>>,
): {
  label: string;
  name: string;
  description: string;
  parameters: Type.TObject<{
    query: Type.TString;
    allowed_x_handles: Type.TOptional<Type.TArray<Type.TString>>;
    excluded_x_handles: Type.TOptional<Type.TArray<Type.TString>>;
    from_date: Type.TOptional<Type.TString>;
    to_date: Type.TOptional<Type.TString>;
    enable_image_understanding: Type.TOptional<Type.TBoolean>;
    enable_video_understanding: Type.TOptional<Type.TBoolean>;
  }>;
  execute: (toolCallId: string, args: Record<string, unknown>) => Promise<AgentToolResult<unknown>>;
};
//#endregion
export { X_SEARCH_HANDLE_LIMIT, buildMissingXSearchApiKeyPayload, createXSearchToolDefinition };
