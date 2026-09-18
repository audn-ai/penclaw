import { s as asFiniteNumber } from "../../number-coercion-C7PMvT3i.js";
import { i as asOptionalRecord } from "../../record-coerce-BCQdFoCN.js";
import { l as normalizeOptionalString } from "../../string-coerce-DJnd-JG-.js";

//#region extensions/openai/realtime-provider-shared.d.ts
declare const trimToUndefined: typeof normalizeOptionalString;
declare function readRealtimeErrorDetail(error: unknown): string;
declare function resolveOpenAIProviderConfigRecord(
  config: Record<string, unknown>,
): Record<string, unknown> | undefined;
declare function captureOpenAIRealtimeWsClose(params: {
  url: string;
  flowId: string;
  capability: "realtime-transcription" | "realtime-voice";
  code: unknown;
  reasonBuffer: unknown;
}): void;
type OpenAIRealtimeClientSecretResult = {
  value: string;
  expiresAt?: number;
};
declare function createOpenAIRealtimeClientSecret(params: {
  authToken: string;
  auditContext: string;
  session: Record<string, unknown>;
  authRejectedMessage?: string;
}): Promise<OpenAIRealtimeClientSecretResult>;
declare function createOpenAIRealtimeTranscriptionClientSecret(params: {
  authToken: string;
  auditContext: string;
  session: Record<string, unknown>;
  authRejectedMessage?: string;
}): Promise<OpenAIRealtimeClientSecretResult>;
//#endregion
export {
  OpenAIRealtimeClientSecretResult,
  asFiniteNumber,
  asOptionalRecord as asObjectRecord,
  captureOpenAIRealtimeWsClose,
  createOpenAIRealtimeClientSecret,
  createOpenAIRealtimeTranscriptionClientSecret,
  readRealtimeErrorDetail,
  resolveOpenAIProviderConfigRecord,
  trimToUndefined,
};
