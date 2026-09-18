import {
  f as MediaUnderstandingProvider,
  n as AudioTranscriptionResult,
  t as AudioTranscriptionRequest,
} from "../../types-Bp5h7fLi.js";
//#region extensions/xai/stt.d.ts
declare function transcribeXaiAudio(
  params: AudioTranscriptionRequest,
): Promise<AudioTranscriptionResult>;
declare function buildXaiMediaUnderstandingProvider(): MediaUnderstandingProvider;
//#endregion
export { buildXaiMediaUnderstandingProvider, transcribeXaiAudio };
