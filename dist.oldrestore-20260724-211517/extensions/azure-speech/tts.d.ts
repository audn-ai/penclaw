import { Il as SpeechVoiceOption } from "../../types-Ga3mNO_F.js";
//#region extensions/azure-speech/tts.d.ts
/** Default Azure Speech neural voice. */
declare const DEFAULT_AZURE_SPEECH_VOICE = "en-US-JennyNeural";
/** Default Azure Speech language. */
declare const DEFAULT_AZURE_SPEECH_LANG = "en-US";
/** Default full-audio output format. */
declare const DEFAULT_AZURE_SPEECH_AUDIO_FORMAT = "audio-24khz-48kbitrate-mono-mp3";
/** Default voice-note output format. */
declare const DEFAULT_AZURE_SPEECH_VOICE_NOTE_FORMAT = "ogg-24khz-16bit-mono-opus";
/** Default telephony output format. */
declare const DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT = "raw-8khz-8bit-mono-mulaw";
/** Resolve and normalize the Azure Speech base URL from endpoint or region. */
declare function normalizeAzureSpeechBaseUrl(params: {
  baseUrl?: string;
  endpoint?: string;
  region?: string;
}): string | undefined;
/** Build escaped SSML for one Azure Speech synthesis request. */
declare function buildAzureSpeechSsml(params: {
  text: string;
  voice: string;
  lang?: string;
}): string;
/** Infer the generated audio file extension from Azure output format. */
declare function inferAzureSpeechFileExtension(outputFormat: string): string;
/** Return whether an Azure output format is voice-note compatible. */
declare function isAzureSpeechVoiceCompatible(outputFormat: string): boolean;
/** List non-deprecated voices from the Azure Speech voices API. */
declare function listAzureSpeechVoices(params: {
  apiKey: string;
  baseUrl?: string;
  endpoint?: string;
  region?: string;
  timeoutMs?: number;
}): Promise<SpeechVoiceOption[]>;
/** Synthesize text to audio bytes using Azure Speech TTS. */
declare function azureSpeechTTS(params: {
  text: string;
  apiKey: string;
  baseUrl?: string;
  endpoint?: string;
  region?: string;
  voice?: string;
  lang?: string;
  outputFormat?: string;
  timeoutMs?: number;
  maxBytes?: number;
}): Promise<Buffer>;
//#endregion
export {
  DEFAULT_AZURE_SPEECH_AUDIO_FORMAT,
  DEFAULT_AZURE_SPEECH_LANG,
  DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT,
  DEFAULT_AZURE_SPEECH_VOICE,
  DEFAULT_AZURE_SPEECH_VOICE_NOTE_FORMAT,
  azureSpeechTTS,
  buildAzureSpeechSsml,
  inferAzureSpeechFileExtension,
  isAzureSpeechVoiceCompatible,
  listAzureSpeechVoices,
  normalizeAzureSpeechBaseUrl,
};
