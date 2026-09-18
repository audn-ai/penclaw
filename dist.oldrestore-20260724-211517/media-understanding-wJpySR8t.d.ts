import { n as AudioTranscriptionResult, t as AudioTranscriptionRequest } from "./types-Bp5h7fLi.js";
//#region packages/media-understanding-common/src/openai-compatible-video.d.ts
/** Minimal OpenAI-compatible video response payload shape. */
type OpenAiCompatibleVideoPayload = {
  choices?: Array<{
    message?: {
      content?:
        | string
        | Array<{
            text?: string;
          }>;
      reasoning_content?: string;
    };
  }>;
};
/** Trim optional strings, falling back when empty. */
declare function resolveMediaUnderstandingString(
  value: string | undefined,
  fallback: string,
): string;
/** Coerce text from OpenAI-compatible content or reasoning fields. */
declare function coerceOpenAiCompatibleVideoText(
  payload: OpenAiCompatibleVideoPayload,
): string | null;
/** Build an OpenAI-compatible request body with an inline data URL video. */
declare function buildOpenAiCompatibleVideoRequestBody(params: {
  model: string;
  prompt: string;
  mime: string;
  buffer: Buffer;
}): {
  model: string;
  messages: {
    role: string;
    content: (
      | {
          type: string;
          text: string;
          video_url?: undefined;
        }
      | {
          type: string;
          video_url: {
            url: string;
          };
          text?: undefined;
        }
    )[];
  }[];
};
//#endregion
//#region src/media-understanding/openai-compatible-audio.d.ts
type OpenAiCompatibleAudioParams = AudioTranscriptionRequest & {
  defaultBaseUrl: string;
  defaultModel: string;
  provider?: string;
};
/** Sends an OpenAI-compatible audio transcription request and returns validated text output. */
declare function transcribeOpenAiCompatibleAudio(
  params: OpenAiCompatibleAudioParams,
): Promise<AudioTranscriptionResult>;
//#endregion
export {
  resolveMediaUnderstandingString as a,
  coerceOpenAiCompatibleVideoText as i,
  OpenAiCompatibleVideoPayload as n,
  buildOpenAiCompatibleVideoRequestBody as r,
  transcribeOpenAiCompatibleAudio as t,
};
