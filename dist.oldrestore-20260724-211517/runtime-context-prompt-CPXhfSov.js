import {
  a as OPENCLAW_RUNTIME_CONTEXT_NOTICE,
  c as extractInternalRuntimeContext,
  i as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE,
  n as INTERNAL_RUNTIME_CONTEXT_END,
  o as OPENCLAW_RUNTIME_EVENT_HEADER,
  r as OPENCLAW_NEXT_TURN_RUNTIME_CONTEXT_HEADER,
  t as INTERNAL_RUNTIME_CONTEXT_BEGIN,
} from "./internal-runtime-context-BW7WOTKc.js";
//#region src/agents/embedded-agent-runner/run/runtime-context-prompt.ts
/**
 * Builds runtime context prompt fragments and custom session messages.
 */
const OPENCLAW_RUNTIME_EVENT_USER_PROMPT = "Continue the OpenClaw runtime event.";
/** Combines inbound context and the current prompt using the channel-provided joiner. */
function buildCurrentInboundPrompt(params) {
  const prefix =
    (params.preferResumableText === true
      ? (params.context?.resumableText ?? params.context?.text)
      : params.context?.text
    )?.trim() ?? "";
  if (!prefix) return params.prompt;
  if (!params.prompt) return prefix;
  return [prefix, params.prompt].join(params.context?.promptJoiner ?? "\n\n");
}
function splitLastPromptOccurrence(text, prompt) {
  const index = text.lastIndexOf(prompt);
  if (index === -1) return null;
  return {
    before: text.slice(0, index),
    after: text.slice(index + prompt.length),
  };
}
function replacePromptOccurrenceWithinHookBounds(params) {
  if (!params.promptBeforeHooks) return null;
  const prependIndex = params.prependContext ? params.text.indexOf(params.prependContext) : -1;
  if (params.prependContext && prependIndex === -1) return null;
  const searchStart = prependIndex === -1 ? 0 : prependIndex + params.prependContext.length;
  const appendIndex = params.appendContext ? params.text.lastIndexOf(params.appendContext) : -1;
  if (params.appendContext && appendIndex < searchStart) return null;
  const searchEnd = appendIndex === -1 ? params.text.length : appendIndex;
  const occurrenceIndex = params.text.lastIndexOf(
    params.promptBeforeHooks,
    searchEnd - params.promptBeforeHooks.length,
  );
  if (
    occurrenceIndex < searchStart ||
    occurrenceIndex + params.promptBeforeHooks.length > searchEnd
  )
    return null;
  return `${params.text.slice(0, occurrenceIndex)}${params.transcriptPrompt}${params.text.slice(occurrenceIndex + params.promptBeforeHooks.length)}`;
}
/**
 * Separates user-authored prompt text from hidden runtime context. Transcript
 * prompt stays user-visible; model prompt may carry runtime-only additions that
 * should be delivered as hidden context instead of persisted as user text.
 */
function resolveRuntimeContextPromptParts(params) {
  const transcriptPrompt = params.transcriptPrompt;
  const shouldExtractInternalRuntimeContext = transcriptPrompt !== void 0;
  const extracted = shouldExtractInternalRuntimeContext
    ? extractInternalRuntimeContext(params.effectivePrompt)
    : { text: params.effectivePrompt };
  const modelPrompt =
    params.modelPrompt === void 0
      ? void 0
      : shouldExtractInternalRuntimeContext
        ? extractInternalRuntimeContext(params.modelPrompt)
        : { text: params.modelPrompt };
  const modelPromptBuildContext = params.modelPromptBuildContext
    ? {
        promptBeforeHooks: extractInternalRuntimeContext(
          params.modelPromptBuildContext.promptBeforeHooks,
        ).text,
        transcriptPromptBeforeTransforms: extractInternalRuntimeContext(
          params.modelPromptBuildContext.transcriptPromptBeforeTransforms,
        ).text,
        promptBeforeAnnotation: extractInternalRuntimeContext(
          params.modelPromptBuildContext.promptBeforeAnnotation,
        ).text,
        prependContext: extractInternalRuntimeContext(params.modelPromptBuildContext.prependContext)
          .text,
        appendContext: extractInternalRuntimeContext(params.modelPromptBuildContext.appendContext)
          .text,
      }
    : void 0;
  const modelPromptText = modelPrompt?.text ?? transcriptPrompt ?? extracted.text;
  const prompt = transcriptPrompt ?? extracted.text;
  if (!prompt.trim() && params.emptyTranscriptMode === "model-prompt")
    return {
      prompt: extracted.text,
      ...(modelPromptText.trim() && modelPromptText !== extracted.text
        ? { modelPrompt: modelPromptText }
        : {}),
      ...(extracted.runtimeContext ? { runtimeContext: extracted.runtimeContext } : {}),
    };
  const sourcePromptParts = modelPromptBuildContext
    ? splitLastPromptOccurrence(
        modelPromptBuildContext.promptBeforeHooks,
        modelPromptBuildContext.transcriptPromptBeforeTransforms,
      )
    : void 0;
  const outerPromptParts = modelPromptBuildContext
    ? splitLastPromptOccurrence(extracted.text, modelPromptBuildContext.promptBeforeAnnotation)
    : void 0;
  const fallbackPromptParts = !modelPromptBuildContext
    ? modelPrompt
      ? (splitLastPromptOccurrence(extracted.text, modelPrompt.text) ??
        (transcriptPrompt ? splitLastPromptOccurrence(extracted.text, transcriptPrompt) : void 0))
      : transcriptPrompt
        ? splitLastPromptOccurrence(extracted.text, transcriptPrompt)
        : void 0
    : void 0;
  const runtimeContext =
    [
      [
        outerPromptParts?.before,
        sourcePromptParts?.before ?? fallbackPromptParts?.before,
        sourcePromptParts?.after ?? fallbackPromptParts?.after,
        outerPromptParts?.after,
      ]
        .map((part) => part?.trim())
        .filter((part) => Boolean(part))
        .join("\n\n"),
      extracted.runtimeContext,
    ]
      .filter((value) => Boolean(value?.trim()))
      .join("\n\n") || (!prompt.trim() ? extracted.text.trim() : void 0);
  if (!prompt.trim())
    return runtimeContext
      ? {
          prompt: OPENCLAW_RUNTIME_EVENT_USER_PROMPT,
          ...(modelPromptText.trim() && modelPromptText !== OPENCLAW_RUNTIME_EVENT_USER_PROMPT
            ? { modelPrompt: modelPromptText }
            : {}),
          runtimeContext,
          runtimeOnly: true,
          runtimeSystemContext: buildRuntimeContextMessageContent({
            runtimeContext,
            kind: "runtime-event",
          }),
        }
      : {
          prompt: "",
          ...(modelPromptText ? { modelPrompt: modelPromptText } : {}),
        };
  const returnModelPromptText =
    Boolean(sourcePromptParts?.before.trim() || sourcePromptParts?.after.trim()) &&
    modelPromptBuildContext &&
    modelPrompt
      ? (replacePromptOccurrenceWithinHookBounds({
          text: modelPromptText,
          promptBeforeHooks: modelPromptBuildContext.promptBeforeHooks,
          transcriptPrompt: modelPromptBuildContext.transcriptPromptBeforeTransforms,
          prependContext: modelPromptBuildContext.prependContext,
          appendContext: modelPromptBuildContext.appendContext,
        }) ?? modelPromptText)
      : modelPromptText;
  return {
    prompt,
    ...(returnModelPromptText.trim() && returnModelPromptText !== prompt
      ? { modelPrompt: returnModelPromptText }
      : {}),
    ...(runtimeContext ? { runtimeContext } : {}),
  };
}
function buildRuntimeContextMessageContent(params) {
  return [
    params.kind === "runtime-event"
      ? OPENCLAW_RUNTIME_EVENT_HEADER
      : OPENCLAW_NEXT_TURN_RUNTIME_CONTEXT_HEADER,
    OPENCLAW_RUNTIME_CONTEXT_NOTICE,
    "",
    INTERNAL_RUNTIME_CONTEXT_BEGIN,
    params.runtimeContext,
    INTERNAL_RUNTIME_CONTEXT_END,
  ].join("\n");
}
/** Creates a non-displayed custom transcript message for runtime context, if any exists. */
function buildRuntimeContextCustomMessage(runtimeContext) {
  const trimmedRuntimeContext = runtimeContext?.trim();
  if (!trimmedRuntimeContext) return;
  return {
    role: "custom",
    customType: OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE,
    content: buildRuntimeContextMessageContent({
      runtimeContext: trimmedRuntimeContext,
      kind: "next-turn",
    }),
    display: false,
    details: {
      source: "openclaw-runtime-context",
      runtimeContextCarrier: true,
    },
    timestamp: Date.now(),
  };
}
//#endregion
export {
  buildRuntimeContextCustomMessage as n,
  resolveRuntimeContextPromptParts as r,
  buildCurrentInboundPrompt as t,
};
