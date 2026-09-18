import { Cu as CurrentInboundPromptContext } from "../../../types-Ga3mNO_F.js";

//#region src/agents/embedded-agent-runner/run/runtime-context-prompt.d.ts
type RuntimeContextPromptParts = {
  prompt: string;
  modelPrompt?: string;
  runtimeContext?: string;
  runtimeOnly?: boolean;
  runtimeSystemContext?: string;
};
/** Hidden custom transcript message that carries runtime context into model conversion. */
type RuntimeContextCustomMessage = {
  role: "custom";
  customType: string;
  content: string;
  display: false;
  details: {
    source: "openclaw-runtime-context";
    runtimeContextCarrier: true;
  };
  timestamp: number;
};
type EmptyTranscriptMode = "model-prompt" | "runtime-event";
type ModelPromptBuildContext = {
  promptBeforeHooks: string;
  transcriptPromptBeforeTransforms: string;
  promptBeforeAnnotation: string;
  prependContext: string;
  appendContext: string;
};
/** Combines inbound context and the current prompt using the channel-provided joiner. */
declare function buildCurrentInboundPrompt(params: {
  context: CurrentInboundPromptContext | undefined;
  prompt: string;
  preferResumableText?: boolean;
}): string;
/**
 * Separates user-authored prompt text from hidden runtime context. Transcript
 * prompt stays user-visible; model prompt may carry runtime-only additions that
 * should be delivered as hidden context instead of persisted as user text.
 */
declare function resolveRuntimeContextPromptParts(params: {
  effectivePrompt: string;
  transcriptPrompt?: string;
  modelPrompt?: string;
  modelPromptBuildContext?: ModelPromptBuildContext;
  emptyTranscriptMode?: EmptyTranscriptMode;
}): RuntimeContextPromptParts;
/** Creates a non-displayed custom transcript message for runtime context, if any exists. */
declare function buildRuntimeContextCustomMessage(
  runtimeContext: string | undefined,
): RuntimeContextCustomMessage | undefined;
//#endregion
export {
  RuntimeContextCustomMessage,
  buildCurrentInboundPrompt,
  buildRuntimeContextCustomMessage,
  resolveRuntimeContextPromptParts,
};
