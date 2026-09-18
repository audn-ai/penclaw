import { t as canonicalizeBase64 } from "./base64-hBzWwdnH.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import "./src-Bl7G9qvi.js";
import { t as formatByteSize } from "./format-DBMNwbgU.js";
import "./errors-BoHeli7m.js";
import {
  n as DEFAULT_IMAGE_MAX_DIMENSION_PX,
  t as DEFAULT_IMAGE_MAX_BYTES,
} from "./image-sanitization-CxLP0YN-.js";
import {
  _ as resizeToJpeg,
  f as isImageProcessorUnavailableError,
  h as readImageMetadataFromHeader,
  o as buildImageResizeSideGrid,
  r as IMAGE_REDUCE_QUALITY_STEPS,
  u as getImageMetadata,
} from "./media-services-Czws84B5.js";
import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/agents/tool-images.ts
/**
 * Tool image output sanitizer.
 *
 * Downscales and recompresses oversized base64 image blocks before provider replay.
 */
const MAX_IMAGE_DIMENSION_PX = DEFAULT_IMAGE_MAX_DIMENSION_PX;
const MAX_IMAGE_BYTES = DEFAULT_IMAGE_MAX_BYTES;
const log = createSubsystemLogger("agents/tool-images");
function isImageTypeBlock(block) {
  return Boolean(block) && typeof block === "object" && block.type === "image";
}
function isImageBlock(block) {
  if (!isImageTypeBlock(block)) return false;
  return typeof block.data === "string" && typeof block.mimeType === "string";
}
function isTextBlock(block) {
  if (!block || typeof block !== "object") return false;
  const rec = block;
  return rec.type === "text" && typeof rec.text === "string";
}
function inferMimeTypeFromBase64(base64) {
  const trimmed = base64.trim();
  if (!trimmed) return;
  if (trimmed.startsWith("/9j/")) return "image/jpeg";
  if (trimmed.startsWith("iVBOR")) return "image/png";
  if (trimmed.startsWith("R0lGOD")) return "image/gif";
}
function imageWithinLimits(buffer, metadata, maxDimensionPx, maxBytes) {
  const width = metadata?.width;
  const height = metadata?.height;
  return (
    typeof width === "number" &&
    typeof height === "number" &&
    width > 0 &&
    height > 0 &&
    buffer.byteLength <= maxBytes &&
    width <= maxDimensionPx &&
    height <= maxDimensionPx &&
    width * height <= 25e6
  );
}
function formatBytesShort(bytes) {
  if (!Number.isFinite(bytes) || bytes < 1024) return `${Math.max(0, Math.round(bytes))}B`;
  return formatByteSize(bytes, {
    style: "legacy-binary",
    maxUnit: "mega",
    separator: "",
    fractionDigits: (_value, unit) => (unit === "kilo" ? 1 : 2),
  });
}
function fileNameFromPathLike(pathLike) {
  const value = pathLike.trim();
  if (!value) return;
  try {
    const candidate = new URL(value).pathname.split("/").findLast(Boolean);
    return candidate && candidate.length > 0 ? candidate : void 0;
  } catch {}
  const candidate = value.replaceAll("\\", "/").split("/").findLast(Boolean);
  return candidate && candidate.length > 0 ? candidate : void 0;
}
function inferImageFileName(params) {
  const rec = params.block;
  for (const key of ["fileName", "filename", "path", "url"]) {
    const raw = rec[key];
    if (typeof raw !== "string" || raw.trim().length === 0) continue;
    const candidate = fileNameFromPathLike(raw);
    if (candidate) return candidate;
  }
  if (typeof rec.name === "string" && rec.name.trim().length > 0) return rec.name.trim();
  if (params.mediaPathHint) {
    const candidate = fileNameFromPathLike(params.mediaPathHint);
    if (candidate) return candidate;
  }
  if (typeof params.label === "string" && params.label.startsWith("read:")) {
    const candidate = fileNameFromPathLike(params.label.slice(5));
    if (candidate) return candidate;
  }
}
async function resizeImageBase64IfNeeded(params) {
  const buf = Buffer.from(params.base64, "base64");
  const headerMeta = readImageMetadataFromHeader(buf);
  if (imageWithinLimits(buf, headerMeta, params.maxDimensionPx, params.maxBytes))
    return {
      base64: params.base64,
      mimeType: params.mimeType,
      resized: false,
      width: headerMeta.width,
      height: headerMeta.height,
    };
  const meta = headerMeta ?? (await getImageMetadata(buf));
  const width = meta?.width;
  const height = meta?.height;
  const overBytes = buf.byteLength > params.maxBytes;
  const hasDimensions = typeof width === "number" && typeof height === "number";
  const overDimensions =
    hasDimensions && (width > params.maxDimensionPx || height > params.maxDimensionPx);
  if (imageWithinLimits(buf, meta, params.maxDimensionPx, params.maxBytes))
    return {
      base64: params.base64,
      mimeType: params.mimeType,
      resized: false,
      width,
      height,
    };
  const maxDim = hasDimensions ? Math.max(width ?? 0, height ?? 0) : params.maxDimensionPx;
  const sideStart = maxDim > 0 ? Math.min(params.maxDimensionPx, maxDim) : params.maxDimensionPx;
  const sideGrid = buildImageResizeSideGrid(params.maxDimensionPx, sideStart);
  let smallest = null;
  let processorUnavailableError;
  for (const side of sideGrid) {
    for (const quality of IMAGE_REDUCE_QUALITY_STEPS) {
      let out;
      try {
        out = await resizeToJpeg({
          buffer: buf,
          maxSide: side,
          quality,
          withoutEnlargement: true,
        });
      } catch (err) {
        if (isImageProcessorUnavailableError(err)) {
          processorUnavailableError = err;
          break;
        }
        throw err;
      }
      if (!smallest || out.byteLength < smallest.size)
        smallest = {
          buffer: out,
          size: out.byteLength,
        };
      if (out.byteLength <= params.maxBytes) {
        const sourcePixels =
          typeof width === "number" && typeof height === "number"
            ? `${width}x${height}px`
            : "unknown";
        const sourceWithFile = params.fileName
          ? `${params.fileName} ${sourcePixels}`
          : sourcePixels;
        const byteReductionPct =
          buf.byteLength > 0
            ? Number((((buf.byteLength - out.byteLength) / buf.byteLength) * 100).toFixed(1))
            : 0;
        log.info(
          `Image resized to fit limits: ${sourceWithFile} ${formatBytesShort(buf.byteLength)} -> ${formatBytesShort(out.byteLength)} (-${byteReductionPct}%)`,
          {
            label: params.label,
            fileName: params.fileName,
            sourceMimeType: params.mimeType,
            sourceWidth: width,
            sourceHeight: height,
            sourceBytes: buf.byteLength,
            maxBytes: params.maxBytes,
            maxDimensionPx: params.maxDimensionPx,
            triggerOverBytes: overBytes,
            triggerOverDimensions: overDimensions,
            outputMimeType: "image/jpeg",
            outputBytes: out.byteLength,
            outputQuality: quality,
            outputMaxSide: side,
            byteReductionPct,
          },
        );
        return {
          base64: out.toString("base64"),
          mimeType: "image/jpeg",
          resized: true,
          width,
          height,
        };
      }
    }
    if (processorUnavailableError) break;
  }
  if (processorUnavailableError) throw toErrorObject(processorUnavailableError, "Non-Error thrown");
  const best = smallest?.buffer ?? buf;
  const maxMb = (params.maxBytes / (1024 * 1024)).toFixed(0);
  const gotMb = (best.byteLength / (1024 * 1024)).toFixed(2);
  const sourcePixels =
    typeof width === "number" && typeof height === "number" ? `${width}x${height}px` : "unknown";
  const sourceWithFile = params.fileName ? `${params.fileName} ${sourcePixels}` : sourcePixels;
  log.warn(
    `Image resize failed to fit limits: ${sourceWithFile} best=${formatBytesShort(best.byteLength)} limit=${formatBytesShort(params.maxBytes)}`,
    {
      label: params.label,
      fileName: params.fileName,
      sourceMimeType: params.mimeType,
      sourceWidth: width,
      sourceHeight: height,
      sourceBytes: buf.byteLength,
      maxDimensionPx: params.maxDimensionPx,
      maxBytes: params.maxBytes,
      smallestCandidateBytes: best.byteLength,
      triggerOverBytes: overBytes,
      triggerOverDimensions: overDimensions,
    },
  );
  throw new Error(`Image could not be reduced below ${maxMb}MB (got ${gotMb}MB)`);
}
async function sanitizeContentBlocksImages(blocks, label, opts = {}) {
  const maxDimensionPx = resolveIntegerOption(opts.maxDimensionPx, MAX_IMAGE_DIMENSION_PX, {
    min: 1,
  });
  const maxBytes = resolveIntegerOption(opts.maxBytes, MAX_IMAGE_BYTES, { min: 1 });
  const out = [];
  for (const block of blocks) {
    if (!isImageBlock(block)) {
      if (isImageTypeBlock(block)) {
        out.push({
          type: "text",
          text: `[${label}] omitted image payload: missing data or mimeType`,
        });
        continue;
      }
      out.push(block);
      continue;
    }
    const data = block.data.trim();
    if (!data) {
      out.push({
        type: "text",
        text: `[${label}] omitted empty image payload`,
      });
      continue;
    }
    const canonicalData = canonicalizeBase64(data);
    if (!canonicalData) {
      out.push({
        type: "text",
        text: `[${label}] omitted image payload: invalid base64`,
      });
      continue;
    }
    try {
      const mimeType = inferMimeTypeFromBase64(canonicalData) ?? block.mimeType;
      const resized = await resizeImageBase64IfNeeded({
        base64: canonicalData,
        mimeType,
        maxDimensionPx,
        maxBytes,
        label,
        fileName: inferImageFileName({
          block,
          label,
        }),
      });
      out.push({
        ...block,
        data: resized.base64,
        mimeType: resized.resized ? resized.mimeType : mimeType,
      });
    } catch (err) {
      out.push({
        type: "text",
        text: `[${label}] omitted image payload: ${String(err)}`,
      });
    }
  }
  return out;
}
async function sanitizeImageBlocks(images, label, opts = {}) {
  if (images.length === 0)
    return {
      images,
      dropped: 0,
    };
  const next = (await sanitizeContentBlocksImages(images, label, opts)).filter(isImageBlock);
  return {
    images: next,
    dropped: Math.max(0, images.length - next.length),
  };
}
async function sanitizeToolResultImages(result, label, opts = {}) {
  const content = Array.isArray(result.content) ? result.content : [];
  if (!content.some((block) => isImageTypeBlock(block) || isTextBlock(block))) return result;
  const next = await sanitizeContentBlocksImages(content, label, opts);
  return {
    ...result,
    content: next,
  };
}
//#endregion
export {
  sanitizeImageBlocks as n,
  sanitizeToolResultImages as r,
  sanitizeContentBlocksImages as t,
};
