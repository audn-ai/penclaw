import { RawData } from "ws";
import { t as XAI_BASE_URL } from "../../model-definitions-D-3k1fdm.js";
import { Il as SpeechVoiceOption } from "../../types-Ga3mNO_F.js";

//#region extensions/xai/tts.d.ts
declare const XAI_TTS_FALLBACK_VOICES: readonly ["ara", "eve", "leo", "rex", "sal"];
declare function normalizeXaiTtsBaseUrl(baseUrl?: string): string;
declare function isValidXaiTtsVoice(voice: string): boolean;
declare function listXaiTtsVoices(params: {
  apiKey: string;
  baseUrl?: string;
}): Promise<SpeechVoiceOption[]>;
declare function normalizeXaiLanguageCode(value: unknown): string | undefined;
type XaiTtsResponseFormat = "mp3" | "wav" | "pcm" | "mulaw" | "alaw";
declare function toXaiTtsWsUrl(params: {
  baseUrl: string;
  voiceId: string;
  language: string;
  responseFormat: XaiTtsResponseFormat;
  speed?: number;
}): string;
declare function assertXaiNativeTtsStreamEndpoint(baseUrl: string): void;
declare function decodeWebSocketTextMessage(data: RawData): string;
declare function xaiTTSStream(params: {
  text: string;
  apiKey: string;
  baseUrl: string;
  voiceId: string;
  language?: string;
  speed?: number;
  responseFormat?: XaiTtsResponseFormat;
  timeoutMs: number;
  maxBytes?: number;
}): Promise<{
  audioStream: ReadableStream<Uint8Array>;
  release: () => Promise<void>;
}>;
declare function xaiTTS(params: {
  text: string;
  apiKey: string;
  baseUrl: string;
  voiceId: string;
  language?: string;
  speed?: number;
  responseFormat?: "mp3" | "wav" | "pcm" | "mulaw" | "alaw";
  timeoutMs: number;
  maxBytes?: number;
}): Promise<Buffer>;
//#endregion
export {
  XAI_BASE_URL,
  XAI_TTS_FALLBACK_VOICES,
  assertXaiNativeTtsStreamEndpoint,
  decodeWebSocketTextMessage,
  isValidXaiTtsVoice,
  listXaiTtsVoices,
  normalizeXaiLanguageCode,
  normalizeXaiTtsBaseUrl,
  toXaiTtsWsUrl,
  xaiTTS,
  xaiTTSStream,
};
