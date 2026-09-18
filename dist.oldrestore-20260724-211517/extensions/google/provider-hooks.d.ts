import {
  Pt as ProviderNormalizeToolSchemasContext,
  Tt as ProviderDefaultThinkingPolicyContext,
  a as AnyAgentTool,
  tn as ProviderToolSchemaDiagnostic,
} from "../../plugin-entry-DPCR66aO.js";
import { p as createGoogleThinkingStreamWrapper } from "../../provider-stream-shared-DPWBD8Dp.js";
import {
  Nn as ProviderSanitizeReplayHistoryContext,
  _n as ProviderReasoningOutputModeContext,
  gn as ProviderReasoningOutputMode,
  td as ProviderThinkingProfile,
  vn as ProviderReplayPolicy,
  yn as ProviderReplayPolicyContext,
} from "../../types-Ga3mNO_F.js";
import { s as AgentMessage } from "../../types-JQFrjdua.js";
//#region extensions/google/provider-hooks.d.ts
declare const GOOGLE_GEMINI_PROVIDER_HOOKS: {
  resolveThinkingProfile: (
    context: ProviderDefaultThinkingPolicyContext,
  ) => ProviderThinkingProfile | undefined;
  wrapStreamFn: typeof createGoogleThinkingStreamWrapper;
  normalizeToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => AnyAgentTool[];
  inspectToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[];
  buildReplayPolicy?:
    | ((ctx: ProviderReplayPolicyContext) => ProviderReplayPolicy | null | undefined)
    | undefined;
  sanitizeReplayHistory?:
    | ((
        ctx: ProviderSanitizeReplayHistoryContext,
      ) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined)
    | undefined;
  resolveReasoningOutputMode?:
    | ((ctx: ProviderReasoningOutputModeContext) => ProviderReasoningOutputMode | null | undefined)
    | undefined;
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS };
