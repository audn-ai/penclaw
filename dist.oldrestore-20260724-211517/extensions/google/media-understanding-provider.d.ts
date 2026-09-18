import {
  C as VideoDescriptionResult,
  S as VideoDescriptionRequest,
  f as MediaUnderstandingProvider,
  n as AudioTranscriptionResult,
  t as AudioTranscriptionRequest,
} from "../../types-Bp5h7fLi.js";
//#region extensions/google/media-understanding-provider.d.ts
declare function transcribeGeminiAudio(
  params: AudioTranscriptionRequest,
): Promise<AudioTranscriptionResult>;
declare function describeGeminiVideo(
  params: VideoDescriptionRequest,
): Promise<VideoDescriptionResult>;
declare const googleMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
export { describeGeminiVideo, googleMediaUnderstandingProvider, transcribeGeminiAudio };
