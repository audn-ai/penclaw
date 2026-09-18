//#region src/media-understanding/openai-audio-api.ts
const OPENAI_AUDIO_TRANSCRIPTIONS_API = "openai-audio-transcriptions";
function resolveOpenAiAudioAuthModelApi(params) {
  if (params.capability === "audio" && params.providerId.trim().toLowerCase() === "openai")
    return OPENAI_AUDIO_TRANSCRIPTIONS_API;
}
//#endregion
export { resolveOpenAiAudioAuthModelApi as n, OPENAI_AUDIO_TRANSCRIPTIONS_API as t };
