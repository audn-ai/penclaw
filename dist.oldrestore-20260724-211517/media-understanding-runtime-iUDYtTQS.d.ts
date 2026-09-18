import {
  c as TranscribeAudioFileParams,
  i as ExtractStructuredWithModelParams,
  n as DescribeImageFileWithModelParams,
  o as RunMediaUnderstandingFileParams,
  r as DescribeVideoFileParams,
  s as RunMediaUnderstandingFileResult,
  t as DescribeImageFileParams,
} from "./runtime-types-QfLkmPUQ.js";
import { b as StructuredExtractionResult, i as ImageDescriptionResult } from "./types-Bp5h7fLi.js";

//#region src/media-understanding/runtime.d.ts
/** Runs media understanding for one local file or remote URL and returns the first matching output. */
declare function runMediaUnderstandingFile(
  params: RunMediaUnderstandingFileParams,
): Promise<RunMediaUnderstandingFileResult>;
/** Describes one image file or URL through the configured image-understanding pipeline. */
declare function describeImageFile(
  params: DescribeImageFileParams,
): Promise<RunMediaUnderstandingFileResult>;
/** Describes one image with an explicit provider/model, bypassing configured media model selection. */
declare function describeImageFileWithModel(
  params: DescribeImageFileWithModelParams,
): Promise<ImageDescriptionResult>;
/** Runs provider-backed structured extraction for multimodal text/image input. */
declare function extractStructuredWithModel(
  params: ExtractStructuredWithModelParams,
): Promise<StructuredExtractionResult>;
/** Describes one video file or URL through the configured video-understanding pipeline. */
declare function describeVideoFile(
  params: DescribeVideoFileParams,
): Promise<RunMediaUnderstandingFileResult>;
/** Transcribes one audio file or URL through the configured audio-understanding pipeline. */
declare function transcribeAudioFile(
  params: TranscribeAudioFileParams,
): Promise<RunMediaUnderstandingFileResult>;
//#endregion
export {
  runMediaUnderstandingFile as a,
  extractStructuredWithModel as i,
  describeImageFileWithModel as n,
  transcribeAudioFile as o,
  describeVideoFile as r,
  describeImageFile as t,
};
