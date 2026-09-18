import {
  Ga as RealtimeTranscriptionSessionCreateRequest,
  Un as RealtimeTranscriptionProviderPlugin,
  za as RealtimeTranscriptionProviderConfig,
} from "../../types-Ga3mNO_F.js";
//#region extensions/deepgram/realtime-transcription-provider.d.ts
type DeepgramRealtimeTranscriptionEncoding = "linear16" | "mulaw" | "alaw";
type DeepgramRealtimeTranscriptionProviderConfig = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  language?: string;
  sampleRate?: number;
  encoding?: DeepgramRealtimeTranscriptionEncoding;
  interimResults?: boolean;
  endpointingMs?: number;
};
type DeepgramRealtimeTranscriptionSessionConfig = RealtimeTranscriptionSessionCreateRequest & {
  apiKey: string;
  baseUrl: string;
  model: string;
  sampleRate: number;
  encoding: DeepgramRealtimeTranscriptionEncoding;
  interimResults: boolean;
  endpointingMs: number;
  language?: string;
};
declare function normalizeDeepgramRealtimeBaseUrl(value?: string): string;
declare function toDeepgramRealtimeWsUrl(
  config: DeepgramRealtimeTranscriptionSessionConfig,
): string;
declare function normalizeProviderConfig(
  config: RealtimeTranscriptionProviderConfig,
): DeepgramRealtimeTranscriptionProviderConfig;
declare function buildDeepgramRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin;
declare const testing: {
  normalizeProviderConfig: typeof normalizeProviderConfig;
  normalizeDeepgramRealtimeBaseUrl: typeof normalizeDeepgramRealtimeBaseUrl;
  toDeepgramRealtimeWsUrl: typeof toDeepgramRealtimeWsUrl;
};
//#endregion
export { testing as __testing, testing, buildDeepgramRealtimeTranscriptionProvider };
