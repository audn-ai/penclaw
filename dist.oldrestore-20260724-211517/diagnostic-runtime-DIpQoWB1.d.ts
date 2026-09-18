//#region src/infra/diagnostic-llm-content.d.ts
/** Per-field policy for diagnostic traces that may include model-visible content. */
type DiagnosticModelContentCapturePolicy = {
  /** Capture chat/message payloads sent to a model. */ inputMessages: boolean /** Capture model response messages. */;
  outputMessages: boolean /** Capture tool invocation arguments. */;
  toolInputs: boolean /** Capture tool result payloads. */;
  toolOutputs: boolean /** Capture the system prompt or instruction block. */;
  systemPrompt: boolean /** Capture tool schemas/definitions presented to a model. */;
  toolDefinitions: boolean /** Whether any model-visible prompt/response/schema content is enabled. */;
  anyModelContent: boolean;
};
/** Resolves model-content diagnostic capture from config, defaulting to no content capture. */
declare function resolveDiagnosticModelContentCapturePolicy(
  config: unknown,
): DiagnosticModelContentCapturePolicy;
//#endregion
export {
  resolveDiagnosticModelContentCapturePolicy as n,
  DiagnosticModelContentCapturePolicy as t,
};
