import { n as OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL } from "./default-models-GLjqEMz-.js";
import {
  r as describeImagesWithModel,
  t as describeImageWithModel,
} from "./image-runtime-Bf0M579x.js";
import { t as transcribeOpenAiCompatibleAudio } from "./media-understanding-CJqVtMxb.js";
//#region extensions/openai/media-understanding-provider.ts
const DEFAULT_OPENAI_AUDIO_BASE_URL = "https://api.openai.com/v1";
async function transcribeOpenAiAudio(params) {
  return await transcribeOpenAiCompatibleAudio({
    ...params,
    provider: "openai",
    defaultBaseUrl: DEFAULT_OPENAI_AUDIO_BASE_URL,
    defaultModel: OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL,
  });
}
const openaiMediaUnderstandingProvider = {
  id: "openai",
  capabilities: ["image", "audio"],
  defaultModels: {
    image: "gpt-5.6-sol",
    audio: OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL,
  },
  autoPriority: {
    image: 20,
    audio: 20,
  },
  describeImage: describeImageWithModel,
  describeImages: describeImagesWithModel,
  transcribeAudio: transcribeOpenAiAudio,
};
//#endregion
export { transcribeOpenAiAudio as n, openaiMediaUnderstandingProvider as t };
