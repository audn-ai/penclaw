import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/infra/diagnostic-llm-content.ts
const NO_MODEL_CONTENT_CAPTURE = Object.freeze({
  inputMessages: false,
  outputMessages: false,
  toolInputs: false,
  toolOutputs: false,
  systemPrompt: false,
  toolDefinitions: false,
  anyModelContent: false,
});
function cloneDiagnosticContentValue(value) {
  try {
    return structuredClone(value);
  } catch {
    try {
      const serialized = JSON.stringify(value);
      return serialized === void 0 ? null : JSON.parse(serialized);
    } catch {
      return String(value);
    }
  }
}
function withDerivedFields(policy) {
  return {
    ...policy,
    anyModelContent:
      policy.inputMessages ||
      policy.outputMessages ||
      policy.systemPrompt ||
      policy.toolDefinitions,
  };
}
/** Resolves model-content diagnostic capture from config, defaulting to no content capture. */
function resolveDiagnosticModelContentCapturePolicy(config) {
  if (!isRecord(config)) return NO_MODEL_CONTENT_CAPTURE;
  const diagnostics = config.diagnostics;
  if (!isRecord(diagnostics) || diagnostics.enabled === false) return NO_MODEL_CONTENT_CAPTURE;
  const otel = diagnostics.otel;
  if (!isRecord(otel) || otel.enabled !== true || otel.traces === false)
    return NO_MODEL_CONTENT_CAPTURE;
  const captureContent = otel.captureContent;
  if (captureContent === true)
    return withDerivedFields({
      inputMessages: true,
      outputMessages: true,
      toolInputs: true,
      toolOutputs: true,
      systemPrompt: false,
      toolDefinitions: true,
    });
  if (!isRecord(captureContent) || captureContent.enabled !== true) return NO_MODEL_CONTENT_CAPTURE;
  return withDerivedFields({
    inputMessages: captureContent.inputMessages === true,
    outputMessages: captureContent.outputMessages === true,
    toolInputs: captureContent.toolInputs === true,
    toolOutputs: captureContent.toolOutputs === true,
    systemPrompt: captureContent.systemPrompt === true,
    toolDefinitions: captureContent.toolDefinitions === true,
  });
}
//#endregion
export { resolveDiagnosticModelContentCapturePolicy as n, cloneDiagnosticContentValue as t };
