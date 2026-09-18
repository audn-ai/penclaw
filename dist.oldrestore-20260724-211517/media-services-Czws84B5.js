import path from "node:path";
import {
  RastermillError,
  RastermillUnavailableError,
  createRastermill,
  isRastermillUnavailableError,
  readImageMetadataFromHeader,
  readImageProbeFromHeader,
} from "rastermill";
import { n as runExec, r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as basenameFromAnyPath } from "./file-name-D1nUHSBH.js";
import { r as writeExternalFileWithinRoot } from "./fs-safe-RNq3oO57.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  n as tempWorkspaceSync,
  r as withTempWorkspace,
} from "./private-temp-workspace-BrSGWjaU.js";
import { t as resolveSystemBin } from "./resolve-system-bin-DHY7NQuY.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region src/media/ffmpeg-limits.ts
/** Shared stdout/stderr buffer cap for ffmpeg and ffprobe child processes. */
const MEDIA_FFMPEG_MAX_BUFFER_BYTES = 10 * 1024 * 1024;
/** Default ffprobe timeout for lightweight metadata probes. */
const MEDIA_FFPROBE_TIMEOUT_MS = 1e4;
/** Default ffmpeg timeout for bounded media conversion work. */
const MEDIA_FFMPEG_TIMEOUT_MS = 45e3;
/** Maximum audio duration accepted by ffmpeg-backed media flows. */
const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS = 1200;
//#endregion
//#region src/media/ffmpeg-exec.ts
function resolveExecOptions(defaultTimeoutMs, options) {
  return {
    input: options?.input,
    logOutput: false,
    maxBuffer: options?.maxBufferBytes ?? 10485760,
    timeoutMs: options?.timeoutMs ?? defaultTimeoutMs,
  };
}
function requireSystemBin(name) {
  const resolved = resolveSystemBin(name, { trust: "standard" });
  if (!resolved) {
    const hint =
      process.platform === "darwin"
        ? "e.g. brew install ffmpeg"
        : "e.g. apt install ffmpeg / dnf install ffmpeg";
    throw new Error(
      `${name} not found in trusted system directories. Install it via your system package manager (${hint}).`,
    );
  }
  return resolved;
}
/** Resolves ffmpeg from trusted system paths before command execution. */
function resolveFfmpegBin() {
  return requireSystemBin("ffmpeg");
}
/** Runs ffprobe with optional stdin input. */
async function runFfprobe(args, options) {
  const { stdout } = await runExec(
    requireSystemBin("ffprobe"),
    args,
    resolveExecOptions(MEDIA_FFPROBE_TIMEOUT_MS, options),
  );
  return stdout;
}
/** Runs ffmpeg with bounded timeout and buffer settings. */
async function runFfmpeg(args, options) {
  const { stdout } = await runExec(
    resolveFfmpegBin(),
    args,
    resolveExecOptions(MEDIA_FFMPEG_TIMEOUT_MS, options),
  );
  return stdout;
}
/** Splits ffprobe CSV-ish output into normalized lowercase fields. */
function parseFfprobeCsvFields(stdout, maxFields) {
  return stdout
    .trim()
    .split(/[,\r\n]+/, maxFields)
    .map((field) => normalizeLowercaseStringOrEmpty(field));
}
function parseFfprobeSampleRateHz(value) {
  if (!value || !/^\d+$/.test(value)) return null;
  const sampleRate = Number(value);
  return Number.isSafeInteger(sampleRate) && sampleRate > 0 ? sampleRate : null;
}
/** Parses codec and positive sample rate from compact ffprobe stream output. */
function parseFfprobeCodecAndSampleRate(stdout) {
  const [codecRaw, sampleRateRaw] = parseFfprobeCsvFields(stdout, 2);
  return {
    codec: codecRaw ? codecRaw : null,
    sampleRateHz: parseFfprobeSampleRateHz(sampleRateRaw),
  };
}
//#endregion
//#region src/media/audio-transcode.ts
const DEFAULT_OPUS_SAMPLE_RATE_HZ = 48e3;
const DEFAULT_OPUS_BITRATE = "64k";
const DEFAULT_OPUS_CHANNELS = 1;
const DEFAULT_TEMP_PREFIX = "audio-opus-";
const DEFAULT_OUTPUT_FILE_NAME = "voice.opus";
function normalizeAudioExtension(params) {
  const fromExtension = params.inputExtension?.trim();
  const normalized = (
    fromExtension
      ? fromExtension.startsWith(".")
        ? fromExtension
        : `.${fromExtension}`
      : path.extname(params.inputFileName ?? "")
  ).toLowerCase();
  return /^\.[a-z0-9]{1,12}$/.test(normalized) ? normalized : ".audio";
}
function normalizeTempPrefix(value) {
  const sanitized = value?.trim().replace(/[^a-zA-Z0-9._-]/g, "-");
  if (!sanitized || sanitized === "." || sanitized === "..") return DEFAULT_TEMP_PREFIX;
  return sanitized.endsWith("-") ? sanitized : `${sanitized}-`;
}
function normalizeOutputFileName(value) {
  const baseName = basenameFromAnyPath(value?.trim() || DEFAULT_OUTPUT_FILE_NAME);
  if (/^[a-zA-Z0-9._-]{1,80}$/.test(baseName) && baseName !== "." && baseName !== "..")
    return baseName;
  return DEFAULT_OUTPUT_FILE_NAME;
}
/** Transcodes arbitrary audio input into mono Opus using a scoped temp workspace. */
async function transcodeAudioBufferToOpus(params) {
  return await withTempWorkspace(
    {
      rootDir: resolvePreferredOpenClawTmpDir(),
      prefix: normalizeTempPrefix(params.tempPrefix),
    },
    async (workspace) => {
      const inputPath = await workspace.write(
        `input${normalizeAudioExtension(params)}`,
        params.audioBuffer,
      );
      const outputFileName = normalizeOutputFileName(params.outputFileName);
      await writeExternalFileWithinRoot({
        rootDir: workspace.dir,
        path: outputFileName,
        write: async (outputPath) => {
          await runFfmpeg(
            [
              "-hide_banner",
              "-loglevel",
              "error",
              "-y",
              "-i",
              inputPath,
              "-vn",
              "-sn",
              "-dn",
              "-c:a",
              "libopus",
              "-b:a",
              params.bitrate ?? DEFAULT_OPUS_BITRATE,
              "-ar",
              String(params.sampleRateHz ?? DEFAULT_OPUS_SAMPLE_RATE_HZ),
              "-ac",
              String(params.channels ?? DEFAULT_OPUS_CHANNELS),
              "-f",
              "opus",
              outputPath,
            ],
            { timeoutMs: params.timeoutMs },
          );
        },
      });
      return await workspace.read(outputFileName);
    },
  );
}
/** Transcodes known audio container pairs, currently using macOS afconvert recipes where needed. */
async function transcodeAudioBuffer(params) {
  const source = normalizeContainerExt(params.sourceExtension);
  const target = normalizeContainerExt(params.targetExtension);
  if (!source || !target)
    return {
      ok: false,
      reason: "invalid-extension",
    };
  if (source === target)
    return {
      ok: false,
      reason: "noop-same-container",
    };
  const recipe = pickAfconvertRecipe(source, target);
  if (!recipe)
    return {
      ok: false,
      reason: "no-recipe",
    };
  if (process.platform !== "darwin")
    return {
      ok: false,
      reason: "platform-unsupported",
    };
  const tmp = tempWorkspaceSync({
    rootDir: resolvePreferredOpenClawTmpDir(),
    prefix: "tts-transcode-",
  });
  const inPath = tmp.write(`in.${source}`, params.audioBuffer);
  const outPath = tmp.path(`out.${target}`);
  try {
    const result = await runAfconvert({
      args: [...recipe, inPath, outPath],
      timeoutMs: params.timeoutMs ?? 5e3,
    });
    if (!result.ok)
      return {
        ok: false,
        reason: "transcoder-failed",
        detail: result.detail,
      };
    return {
      ok: true,
      buffer: tmp.read(`out.${target}`),
    };
  } catch (err) {
    return {
      ok: false,
      reason: "transcoder-failed",
      detail: err.message,
    };
  } finally {
    tmp.cleanup();
  }
}
function normalizeContainerExt(ext) {
  const trimmed = ext.trim().toLowerCase().replace(/^\./, "");
  return /^[a-z0-9]{1,12}$/.test(trimmed) ? trimmed : void 0;
}
function pickAfconvertRecipe(_source, target) {
  if (target === "caf") return ["-f", "caff", "-d", "opus@24000", "-c", "1"];
}
async function runAfconvert(params) {
  try {
    const result = await runCommandWithTimeout(["/usr/bin/afconvert", ...params.args], {
      maxOutputBytes: 1024,
      timeoutMs: params.timeoutMs,
    });
    if (result.termination === "timeout")
      return {
        ok: false,
        detail: `timeout-${params.timeoutMs}ms`,
      };
    return result.code === 0
      ? { ok: true }
      : {
          ok: false,
          detail: `exit-${result.code ?? "unknown"}`,
        };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
//#endregion
//#region src/media/image-ops.ts
/** OpenClaw-facing image backend availability error, preserving the failed operation and causes. */
var ImageProcessorUnavailableError = class extends Error {
  constructor(operation, message, causes = []) {
    super(message ?? `Image processor unavailable for ${operation}`, {
      cause: causes.find((cause) => cause instanceof Error),
    });
    this.code = "IMAGE_PROCESSOR_UNAVAILABLE";
    this.name = "ImageProcessorUnavailableError";
    this.operation = operation;
    this.causes = causes;
  }
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
const IMAGE_REDUCE_QUALITY_STEPS = [85, 75, 65, 55, 45, 35];
/** Shared input/output pixel cap for Rastermill-backed image operations. */
const MAX_IMAGE_INPUT_PIXELS = 25e6;
const loadPhotonRuntime = createLazyRuntimeModule(() => import("./photon.runtime.js"));
/** Creates a Rastermill processor with OpenClaw temp-dir, pixel-limit, and command trust policy. */
function createImageProcessor() {
  return createRastermill({
    execution: "auto",
    limits: {
      inputPixels: MAX_IMAGE_INPUT_PIXELS,
      outputPixels: MAX_IMAGE_INPUT_PIXELS,
    },
    temp: {
      rootDir: resolvePreferredOpenClawTmpDir(),
      prefix: "openclaw-img-",
    },
    commandResolver: (command) =>
      resolveSystemBin(command, { trust: command === "powershell" ? "strict" : "standard" }),
  });
}
/** Detects either OpenClaw's wrapper error or Rastermill's native unavailable error. */
function isImageProcessorUnavailableError(err) {
  return err instanceof ImageProcessorUnavailableError || isRastermillUnavailableError(err);
}
/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
function buildImageResizeSideGrid(maxSide, sideStart) {
  return [sideStart, 1800, 1600, 1400, 1200, 1e3, 800]
    .map((value) => Math.min(maxSide, value))
    .filter((value, idx, arr) => value > 0 && arr.indexOf(value) === idx)
    .toSorted((a, b) => b - a);
}
/** Reads dimensions from image header bytes without invoking a full image decode. */
function readImageMetadataFromHeader$1(buffer) {
  return readImageMetadataFromHeader(buffer);
}
/** Reads image probe data from header bytes without invoking a full image decode. */
function readImageProbeFromHeader$1(buffer) {
  return readImageProbeFromHeader(buffer);
}
function wrapRastermillUnavailable(operation, error) {
  if (error instanceof RastermillUnavailableError)
    throw new ImageProcessorUnavailableError(operation, error.message, error.causes);
  throw error;
}
/** Fully probes image dimensions through Rastermill when header-only metadata is insufficient. */
async function getImageMetadata(buffer) {
  const info = await createImageProcessor().probe(buffer);
  return info
    ? {
        width: info.width,
        height: info.height,
      }
    : null;
}
/** Normalizes EXIF orientation when possible while leaving bytes unchanged if the backend is unavailable. */
async function normalizeExifOrientation(buffer) {
  try {
    const rastermill = createImageProcessor();
    const info = await rastermill.probe(buffer);
    if (!info)
      return (
        await rastermill.encode(buffer, {
          format: "jpeg",
          autoOrient: true,
        })
      ).data;
    if (!info?.orientation || info.orientation === 1) return buffer;
    return (
      await rastermill.encode(buffer, {
        format: "jpeg",
        autoOrient: true,
      })
    ).data;
  } catch (error) {
    if (isImageProcessorUnavailableError(error)) return buffer;
    throw error;
  }
}
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
async function resizeToJpeg(params) {
  try {
    return (
      await createImageProcessor().encode(params.buffer, {
        format: "jpeg",
        resize: {
          maxSide: params.maxSide,
          enlarge: params.withoutEnlargement === false,
        },
        quality: params.quality,
      })
    ).data;
  } catch (error) {
    return wrapRastermillUnavailable("resizeToJpeg", error);
  }
}
/** Converts HEIC/HEIF-like image bytes into JPEG through the shared image processor. */
async function convertHeicToJpeg(buffer) {
  try {
    return (await createImageProcessor().encode(buffer, { format: "jpeg" })).data;
  } catch (error) {
    return wrapRastermillUnavailable("convertHeicToJpeg", error);
  }
}
/** Converts image bytes to PNG, including BMP fallback unsupported by Rastermill's Photon gate. */
async function convertImageToPng(buffer) {
  try {
    return (await createImageProcessor().encode(buffer, { format: "png" })).data;
  } catch (error) {
    const probe = readImageProbeFromHeader(buffer);
    if (
      !(
        probe &&
        probe.format === "bmp" &&
        probe.width > 0 &&
        probe.height > 0 &&
        probe.width <= 25e6 / probe.height
      )
    )
      throw error;
    try {
      return (await loadPhotonRuntime()).convertBmpToPngWithPhoton(buffer);
    } catch {
      throw error;
    }
  }
}
/** Detects alpha support using a full transparency probe, falling back to trusted header metadata. */
async function hasAlphaChannel(buffer) {
  try {
    return (await createImageProcessor().transparency(buffer)).hasAlphaChannel;
  } catch (error) {
    const headerHasAlpha = readImageProbeFromHeader(buffer)?.hasAlpha === true;
    if (isRastermillUnavailableError(error)) return headerHasAlpha;
    if (
      error instanceof RastermillError &&
      error.code === "RASTERMILL_UNDECODABLE" &&
      readImageProbeFromHeader(buffer)
    )
      return headerHasAlpha;
    throw error;
  }
}
/** Resizes or encodes image bytes as PNG through the shared image processor. */
async function resizeToPng(params) {
  try {
    return (
      await createImageProcessor().encode(params.buffer, {
        format: "png",
        resize: {
          maxSide: params.maxSide,
          enlarge: params.withoutEnlargement === false,
        },
        ...(params.compressionLevel === void 0
          ? {}
          : { compressionLevel: params.compressionLevel }),
      })
    ).data;
  } catch (error) {
    return wrapRastermillUnavailable("resizeToPng", error);
  }
}
/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
async function optimizeImageToPng(buffer, maxBytes, options) {
  let out;
  try {
    out = await createImageProcessor().encode(buffer, {
      format: "png",
      maxBytes,
      search: options?.sides === void 0 ? {} : { maxSide: options.sides },
    });
  } catch (error) {
    wrapRastermillUnavailable("optimizeImageToPng", error);
  }
  return {
    buffer: out.data,
    optimizedSize: out.bytes,
    resizeSide: out.chosen.maxSide ?? out.width,
    compressionLevel: out.chosen.compressionLevel ?? 6,
  };
}
//#endregion
//#region src/media/video-dimensions.ts
function parsePositiveDimension(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return;
  return value;
}
/** Parses ffprobe JSON output, accepting only positive integer first-stream dimensions. */
function parseFfprobeVideoDimensions(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return;
  }
  if (!parsed || typeof parsed !== "object") return;
  const streams = parsed.streams;
  const stream = Array.isArray(streams) ? streams[0] : void 0;
  if (!stream || typeof stream !== "object") return;
  const record = stream;
  const width = parsePositiveDimension(record.width);
  const height = parsePositiveDimension(record.height);
  return width && height
    ? {
        width,
        height,
      }
    : void 0;
}
/** Probes a video buffer through ffprobe stdin and treats probe failures as unknown dimensions. */
async function probeVideoDimensions(buffer) {
  try {
    return parseFfprobeVideoDimensions(
      await runFfprobe(
        [
          "-v",
          "error",
          "-select_streams",
          "v:0",
          "-show_entries",
          "stream=width,height",
          "-of",
          "json",
          "pipe:0",
        ],
        { input: buffer },
      ),
    );
  } catch {
    return;
  }
}
//#endregion
export {
  resolveFfmpegBin as C,
  MEDIA_FFMPEG_MAX_BUFFER_BYTES as D,
  MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS as E,
  MEDIA_FFMPEG_TIMEOUT_MS as O,
  parseFfprobeCsvFields as S,
  runFfprobe as T,
  resizeToJpeg as _,
  MAX_IMAGE_INPUT_PIXELS as a,
  transcodeAudioBufferToOpus as b,
  convertImageToPng as c,
  hasAlphaChannel as d,
  isImageProcessorUnavailableError as f,
  readImageProbeFromHeader$1 as g,
  readImageMetadataFromHeader$1 as h,
  ImageProcessorUnavailableError as i,
  MEDIA_FFPROBE_TIMEOUT_MS as k,
  createImageProcessor as l,
  optimizeImageToPng as m,
  probeVideoDimensions as n,
  buildImageResizeSideGrid as o,
  normalizeExifOrientation as p,
  IMAGE_REDUCE_QUALITY_STEPS as r,
  convertHeicToJpeg as s,
  parseFfprobeVideoDimensions as t,
  getImageMetadata as u,
  resizeToPng as v,
  runFfmpeg as w,
  parseFfprobeCodecAndSampleRate as x,
  transcodeAudioBuffer as y,
};
