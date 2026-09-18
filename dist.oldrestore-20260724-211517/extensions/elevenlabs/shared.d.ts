//#region extensions/elevenlabs/shared.d.ts
declare const DEFAULT_ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";
declare function isValidElevenLabsVoiceId(voiceId: string): boolean;
declare function normalizeElevenLabsBaseUrl(baseUrl?: string): string;
//#endregion
export { DEFAULT_ELEVENLABS_BASE_URL, isValidElevenLabsVoiceId, normalizeElevenLabsBaseUrl };
