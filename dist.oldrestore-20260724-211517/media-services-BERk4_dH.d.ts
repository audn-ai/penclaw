import { ImageMetadata } from "rastermill";

//#region src/media/local-media-access.d.ts
/** Machine-readable reasons local media path validation can fail. */
type LocalMediaAccessErrorCode =
  | "path-not-allowed"
  | "invalid-root"
  | "invalid-file-url"
  | "network-path-not-allowed"
  | "unsafe-bypass"
  | "not-found"
  | "invalid-path"
  | "not-file";
/** Error raised when a local media path escapes the configured allowlist. */
declare class LocalMediaAccessError extends Error {
  code: LocalMediaAccessErrorCode;
  constructor(code: LocalMediaAccessErrorCode, message: string, options?: ErrorOptions);
}
/** Returns the default root allowlist for local media reads. */
declare function getDefaultLocalRoots(): readonly string[];
/** Verifies that a local media path is managed inbound media or lives under allowed roots. */
declare function assertLocalMediaAllowed(
  mediaPath: string,
  localRoots: readonly string[] | "any" | undefined,
  options?: {
    inboundRoots?: readonly string[];
    resolvedRoots?: readonly string[];
    resolveRoots?: () => Promise<readonly string[]>;
  },
): Promise<void>;
//#endregion
//#region src/media/audio-transcode.d.ts
/** Transcodes arbitrary audio input into mono Opus using a scoped temp workspace. */
declare function transcodeAudioBufferToOpus(params: {
  audioBuffer: Buffer;
  inputExtension?: string;
  inputFileName?: string;
  tempPrefix?: string;
  outputFileName?: string;
  timeoutMs?: number;
  sampleRateHz?: number;
  bitrate?: string;
  channels?: number;
}): Promise<Buffer>;
/** Outcome for lightweight container transcodes that may be unsupported or intentionally skipped. */
type AudioContainerTranscodeOutcome =
  | {
      ok: true;
      buffer: Buffer;
    }
  | {
      ok: false;
      reason:
        | "platform-unsupported"
        | "invalid-extension"
        | "noop-same-container"
        | "no-recipe"
        | "transcoder-failed";
      detail?: string;
    };
/** Transcodes known audio container pairs, currently using macOS afconvert recipes where needed. */
declare function transcodeAudioBuffer(params: {
  audioBuffer: Buffer;
  sourceExtension: string;
  targetExtension: string;
  timeoutMs?: number;
}): Promise<AudioContainerTranscodeOutcome>;
//#endregion
//#region src/media/ffmpeg-exec.d.ts
/** Process limits and optional stdin payload for ffmpeg/ffprobe helper calls. */
type MediaExecOptions = {
  timeoutMs?: number;
  maxBufferBytes?: number;
  input?: Buffer | string;
};
/** Resolves ffmpeg from trusted system paths before command execution. */
declare function resolveFfmpegBin(): string;
/** Runs ffprobe with optional stdin input. */
declare function runFfprobe(args: string[], options?: MediaExecOptions): Promise<string>;
/** Runs ffmpeg with bounded timeout and buffer settings. */
declare function runFfmpeg(args: string[], options?: MediaExecOptions): Promise<string>;
/** Splits ffprobe CSV-ish output into normalized lowercase fields. */
declare function parseFfprobeCsvFields(stdout: string, maxFields: number): string[];
/** Parses codec and positive sample rate from compact ffprobe stream output. */
declare function parseFfprobeCodecAndSampleRate(stdout: string): {
  codec: string | null;
  sampleRateHz: number | null;
};
//#endregion
//#region src/media/image-ops.d.ts
/** OpenClaw-facing image backend availability error, preserving the failed operation and causes. */
declare class ImageProcessorUnavailableError extends Error {
  readonly code = "IMAGE_PROCESSOR_UNAVAILABLE";
  readonly operation: string;
  readonly causes: unknown[];
  constructor(operation: string, message?: string, causes?: unknown[]);
}
/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};
/** PNG resize request passed through the media-runtime/plugin SDK surface. */
type ResizeToPngParams = {
  buffer: Buffer;
  maxSide: number;
  compressionLevel?: number;
  withoutEnlargement?: boolean;
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
declare const IMAGE_REDUCE_QUALITY_STEPS: readonly [85, 75, 65, 55, 45, 35];
/** Shared input/output pixel cap for Rastermill-backed image operations. */
declare const MAX_IMAGE_INPUT_PIXELS = 25000000;
/** Detects either OpenClaw's wrapper error or Rastermill's native unavailable error. */
declare function isImageProcessorUnavailableError(err: unknown): boolean;
/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
declare function buildImageResizeSideGrid(maxSide: number, sideStart: number): number[];
/** Fully probes image dimensions through Rastermill when header-only metadata is insufficient. */
declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Normalizes EXIF orientation when possible while leaving bytes unchanged if the backend is unavailable. */
declare function normalizeExifOrientation(buffer: Buffer): Promise<Buffer>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
/** Converts HEIC/HEIF-like image bytes into JPEG through the shared image processor. */
declare function convertHeicToJpeg(buffer: Buffer): Promise<Buffer>;
/** Detects alpha support using a full transparency probe, falling back to trusted header metadata. */
declare function hasAlphaChannel(buffer: Buffer): Promise<boolean>;
/** Resizes or encodes image bytes as PNG through the shared image processor. */
declare function resizeToPng(params: ResizeToPngParams): Promise<Buffer>;
/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
declare function optimizeImageToPng(
  buffer: Buffer,
  maxBytes: number,
  options?: {
    sides?: readonly number[];
  },
): Promise<{
  buffer: Buffer;
  optimizedSize: number;
  resizeSide: number;
  compressionLevel: number;
}>;
//#endregion
//#region src/media/video-dimensions.d.ts
/** Positive video dimensions reported by ffprobe for the first video stream. */
type VideoDimensions = {
  width: number;
  height: number;
};
/** Parses ffprobe JSON output, accepting only positive integer first-stream dimensions. */
declare function parseFfprobeVideoDimensions(stdout: string): VideoDimensions | undefined;
/** Probes a video buffer through ffprobe stdin and treats probe failures as unknown dimensions. */
declare function probeVideoDimensions(buffer: Buffer): Promise<VideoDimensions | undefined>;
//#endregion
export {
  AudioContainerTranscodeOutcome as C,
  LocalMediaAccessErrorCode as D,
  LocalMediaAccessError as E,
  assertLocalMediaAllowed as O,
  runFfprobe as S,
  transcodeAudioBufferToOpus as T,
  MediaExecOptions as _,
  ImageMetadata as a,
  resolveFfmpegBin as b,
  buildImageResizeSideGrid as c,
  hasAlphaChannel as d,
  isImageProcessorUnavailableError as f,
  resizeToPng as g,
  resizeToJpeg as h,
  IMAGE_REDUCE_QUALITY_STEPS as i,
  getDefaultLocalRoots as k,
  convertHeicToJpeg as l,
  optimizeImageToPng as m,
  parseFfprobeVideoDimensions as n,
  ImageProcessorUnavailableError as o,
  normalizeExifOrientation as p,
  probeVideoDimensions as r,
  MAX_IMAGE_INPUT_PIXELS as s,
  VideoDimensions as t,
  getImageMetadata as u,
  parseFfprobeCodecAndSampleRate as v,
  transcodeAudioBuffer as w,
  runFfmpeg as x,
  parseFfprobeCsvFields as y,
};
