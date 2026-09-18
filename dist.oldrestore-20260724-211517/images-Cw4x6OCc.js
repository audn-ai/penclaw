import path from "node:path";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as log } from "./logger-C5RMMskO.js";
import "./utils-DtcDeqWS.js";
import "./local-file-access-CBe_wA_B.js";
import { o as resolveMediaReferenceLocalPath } from "./media-reference-Cboth956.js";
import { g as assertNoWindowsNetworkPath, x as safeFileURLToPath } from "./path-DILYn_gk.js";
import {
  n as resolveSandboxedBridgeMediaPath,
  t as createSandboxBridgeReadFile,
} from "./sandbox-media-paths-DZW05RJh.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { n as sanitizeImageBlocks } from "./tool-images-Czo0NZbj.js";
import { n as loadWebMedia } from "./web-media-3hQ71Ejp.js";
//#region src/agents/embedded-agent-runner/run/images.ts
/**
 * Detects, resolves, and loads prompt image references for model input.
 */
/**
 * Common image file extensions for detection.
 */
const IMAGE_EXTENSION_NAMES = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "tiff",
  "tif",
  "heic",
  "heif",
];
const IMAGE_EXTENSIONS = /* @__PURE__ */ new Set();
for (const ext of IMAGE_EXTENSION_NAMES) IMAGE_EXTENSIONS.add(`.${ext}`);
const IMAGE_EXTENSION_PATTERN = IMAGE_EXTENSION_NAMES.join("|");
const MEDIA_ATTACHED_PATH_REGEX_SOURCE =
  "^\\s*(.+?\\.(?:" + IMAGE_EXTENSION_PATTERN + "))\\s*(?:\\(|$|\\|)";
const MESSAGE_IMAGE_REGEX_SOURCE =
  "\\[Image:\\s*source:\\s*([^\\]]+\\.(?:" + IMAGE_EXTENSION_PATTERN + "))\\]";
const FILE_URL_REGEX_SOURCE = "file://[^\\s<>\"'`\\]]+\\.(?:" + IMAGE_EXTENSION_PATTERN + ")";
const WINDOWS_DRIVE_PATH_REGEX_SOURCE =
  "(?:^|\\s|[\"'`(])([A-Za-z]:[\\\\/][^\\s\"'`()\\[\\]]*\\.(?:" + IMAGE_EXTENSION_PATTERN + "))";
const PATH_REGEX_SOURCE =
  "(?:^|\\s|[\"'`(])((\\.\\.?/|[~/])[^\\s\"'`()\\[\\]]*\\.(?:" + IMAGE_EXTENSION_PATTERN + "))";
const MEDIA_ATTACHED_PATTERN = /\[media attached(?:\s+\d+\/\d+)?:\s*([^\]]+)\]/gi;
const MEDIA_ATTACHED_PATH_PATTERN = new RegExp(MEDIA_ATTACHED_PATH_REGEX_SOURCE, "i");
const MESSAGE_IMAGE_PATTERN = new RegExp(MESSAGE_IMAGE_REGEX_SOURCE, "gi");
const FILE_URL_PATTERN = new RegExp(FILE_URL_REGEX_SOURCE, "gi");
const WINDOWS_DRIVE_PATH_PATTERN = new RegExp(WINDOWS_DRIVE_PATH_REGEX_SOURCE, "gi");
const PATH_PATTERN = new RegExp(PATH_REGEX_SOURCE, "gi");
/**
 * Matches the opaque media URI written by the Gateway's claim-check offload:
 *   media://inbound/<uuid-or-id>
 *
 * Uses an exclusion-based character class rather than a whitelist so that
 * Unicode filenames (e.g. Chinese characters) preserved by sanitizeFilename
 * in store.ts are matched correctly.
 *
 * Explicitly excluded from the ID segment:
 *   ]      — closes the surrounding [media attached: ...] bracket
 *   \s     — any whitespace (space, newline, tab) — terminates the token
 *   /      — forward slash path separator (traversal prevention)
 *   \      — back slash path separator (traversal prevention)
 *   \x00   — null byte (path injection prevention)
 *
 * resolveMediaBufferPath applies its own guards against these characters, but
 * excluding them here provides defence-in-depth at the parsing layer.
 *
 * Example valid IDs:
 *   "1c77ce17-20b9-4546-be64-6e36a9adcb2c.png"
 *   "photo---1c77ce17-20b9-4546-be64-6e36a9adcb2c.png"
 *   "图片---1c77ce17-20b9-4546-be64-6e36a9adcb2c.png"
 */
const MEDIA_URI_REGEX = /\bmedia:\/\/inbound\/([^\]\s/\\]+)/;
/**
 * Checks if a file extension indicates an image file.
 */
function isImageExtension(filePath) {
  const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
  return IMAGE_EXTENSIONS.has(ext);
}
function normalizeRefForDedupe(raw) {
  return process.platform === "win32" ? normalizeLowercaseStringOrEmpty(raw) : raw;
}
function isOpenClawCliImageCachePath(filePath) {
  const parts = filePath.replaceAll("\\", "/").split("/");
  return parts.some((part, index) => {
    if (part === ".openclaw-cli-images") return true;
    const parent = parts[index - 1] ?? "";
    return part === "openclaw-cli-images" && /^openclaw(?:-\d+)?$/.test(parent);
  });
}
/**
 * Rebuilds the model image array in the same order the prompt saw them:
 * existing inline images and offloaded attachments follow `imageOrder`, then
 * explicit prompt path/media refs are appended after attachment-owned images.
 */
function mergePromptAttachmentImages(params) {
  const promptImages = [];
  const existingImages = params.existingImages ?? [];
  const offloadedImages = params.offloadedImages ?? [];
  if (params.imageOrder && params.imageOrder.length > 0) {
    let inlineIndex = 0;
    let offloadedIndex = 0;
    for (const entry of params.imageOrder) {
      if (entry === "inline") {
        const image = existingImages[inlineIndex++];
        if (image) promptImages.push(image);
        continue;
      }
      const image = offloadedImages[offloadedIndex++];
      if (image) promptImages.push(image);
    }
    promptImages.push(...existingImages.slice(inlineIndex));
    while (offloadedIndex < offloadedImages.length) {
      const image = offloadedImages[offloadedIndex++];
      if (image) promptImages.push(image);
    }
  } else {
    promptImages.push(...existingImages);
    for (const image of offloadedImages) if (image) promptImages.push(image);
  }
  promptImages.push(...(params.promptRefImages ?? []));
  return promptImages;
}
function createRefCountMap(refs) {
  const counts = /* @__PURE__ */ new Map();
  for (const ref of refs) {
    const key = `${ref.type}\0${normalizeRefForDedupe(ref.resolved)}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}
function consumeRefCount(counts, ref) {
  const key = `${ref.type}\0${normalizeRefForDedupe(ref.resolved)}`;
  const count = counts.get(key) ?? 0;
  if (count <= 0) return false;
  if (count === 1) counts.delete(key);
  else counts.set(key, count - 1);
  return true;
}
/**
 * Reads only the leading attachment boilerplate block. User-authored image refs
 * after the first blank/non-attachment line must remain prompt refs.
 */
function extractLeadingAttachmentPrompt(prompt) {
  const lines = prompt.split(/\r?\n/);
  const attachmentLines = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) break;
    if (/^\[media attached:\s*\d+\s+files?\]$/i.test(trimmed)) {
      attachmentLines.push(trimmed);
      continue;
    }
    if (/^\[media attached(?:\s+\d+\/\d+)?:\s*[^\]]+\]$/i.test(trimmed)) {
      attachmentLines.push(trimmed);
      continue;
    }
    break;
  }
  return attachmentLines.join("\n");
}
function extractLeadingInlineAttachmentRefs(prompt, count) {
  if (count <= 0) return [];
  const attachmentPrompt = extractLeadingAttachmentPrompt(prompt);
  if (!attachmentPrompt) return [];
  return detectImageReferences(attachmentPrompt).slice(0, count);
}
/**
 * Finds trailing media:// attachment lines produced by claim-check offload. The
 * reverse scan stops at the first non-attachment line so prompt text above it is
 * not accidentally treated as attachment boilerplate.
 */
function extractTrailingAttachmentMediaUris(prompt, count) {
  if (count <= 0) return [];
  const lines = prompt.split(/\r?\n/);
  const uris = [];
  for (let index = lines.length - 1; index >= 0 && uris.length < count; index--) {
    const line = lines[index]?.trim();
    if (!line || line.includes("\0")) break;
    const match = line.match(/^\[media attached:\s*(media:\/\/inbound\/[^\]\s/\\]+)\]$/);
    if (!match?.[1]) break;
    uris.push(match[1]);
  }
  for (let left = 0, right = uris.length - 1; left < right; left += 1, right -= 1) {
    const leftUri = uris.at(left);
    const rightUri = uris.at(right);
    if (leftUri === void 0 || rightUri === void 0) break;
    uris[left] = rightUri;
    uris[right] = leftUri;
  }
  return uris;
}
/**
 * Separates image refs that came from attachment boilerplate from refs the user
 * actually typed into the prompt. Attachment refs are already represented by
 * existing/offloaded image content and should not be loaded a second time.
 */
function splitPromptAndAttachmentRefs(params) {
  const existingImageCount = params.existingImageCount ?? 0;
  const inlineOrderCount = params.imageOrder?.filter((entry) => entry === "inline").length;
  const inlineAttachmentRefCount = Math.min(
    existingImageCount,
    inlineOrderCount ?? existingImageCount,
  );
  const inlineAttachmentRefs = createRefCountMap(
    extractLeadingInlineAttachmentRefs(params.prompt, inlineAttachmentRefCount),
  );
  const offloadedCount = params.imageOrder?.filter((entry) => entry === "offloaded").length ?? 0;
  const attachmentUris = new Set(
    offloadedCount > 0 ? extractTrailingAttachmentMediaUris(params.prompt, offloadedCount) : [],
  );
  const promptRefs = [];
  const attachmentRefs = [];
  for (const ref of params.refs) {
    if (consumeRefCount(inlineAttachmentRefs, ref)) continue;
    if (ref.type === "media-uri" && attachmentUris.has(ref.resolved)) {
      attachmentRefs.push(ref);
      continue;
    }
    promptRefs.push(ref);
  }
  return {
    promptRefs,
    attachmentRefs,
  };
}
async function sanitizeImagesWithLog(images, label, imageSanitization) {
  const { images: sanitized, dropped } = await sanitizeImageBlocks(
    images,
    label,
    imageSanitization,
  );
  if (dropped > 0)
    log.warn(`Native image: dropped ${dropped} image(s) after sanitization (${label}).`);
  return sanitized;
}
/**
 * Detects image references in a user prompt.
 *
 * Patterns detected:
 * - Absolute paths: /path/to/image.png
 * - Relative paths: ./image.png, ../images/photo.jpg
 * - Home paths: ~/Pictures/screenshot.png
 * - file:// URLs: file:///path/to/image.png
 * - Message attachments: [Image: source: /path/to/image.jpg]
 * - Gateway claim-check URIs: [media attached: media://inbound/<id>]
 *
 * @param prompt The user prompt text to scan
 * @returns Array of detected image references
 */
function detectImageReferences(prompt) {
  const refs = [];
  const seen = /* @__PURE__ */ new Set();
  const addPathRef = (raw) => {
    const trimmed = raw.trim();
    const dedupeKey = normalizeRefForDedupe(trimmed);
    if (!trimmed || seen.has(dedupeKey)) return;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return;
    if (!isImageExtension(trimmed)) return;
    try {
      assertNoWindowsNetworkPath(trimmed, "Image path");
    } catch {
      return;
    }
    const resolved = trimmed.startsWith("~") ? resolveUserPath(trimmed) : trimmed;
    if (isOpenClawCliImageCachePath(resolved)) return;
    seen.add(dedupeKey);
    refs.push({
      raw: trimmed,
      type: "path",
      resolved,
    });
  };
  MEDIA_ATTACHED_PATTERN.lastIndex = 0;
  MESSAGE_IMAGE_PATTERN.lastIndex = 0;
  FILE_URL_PATTERN.lastIndex = 0;
  WINDOWS_DRIVE_PATH_PATTERN.lastIndex = 0;
  PATH_PATTERN.lastIndex = 0;
  let match;
  while ((match = MEDIA_ATTACHED_PATTERN.exec(prompt)) !== null) {
    const content = match[1];
    if (content === void 0) continue;
    if (/^\d+\s+files?$/i.test(content.trim())) continue;
    const mediaId = content.match(MEDIA_URI_REGEX)?.at(1);
    if (mediaId && !mediaId.includes("\0")) {
      const uri = `media://inbound/${mediaId}`;
      const dedupeKey = normalizeRefForDedupe(uri);
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        refs.push({
          raw: uri,
          type: "media-uri",
          resolved: uri,
        });
      }
      continue;
    }
    const pathMatch = content.match(MEDIA_ATTACHED_PATH_PATTERN);
    if (pathMatch?.[1]) addPathRef(pathMatch[1].trim());
  }
  while ((match = MESSAGE_IMAGE_PATTERN.exec(prompt)) !== null) {
    const raw = match[1]?.trim();
    if (raw) addPathRef(raw);
  }
  while ((match = FILE_URL_PATTERN.exec(prompt)) !== null) {
    const raw = match[0];
    const dedupeKey = normalizeRefForDedupe(raw);
    if (seen.has(dedupeKey)) continue;
    try {
      const resolved = safeFileURLToPath(raw);
      if (isOpenClawCliImageCachePath(resolved)) continue;
      seen.add(dedupeKey);
      refs.push({
        raw,
        type: "path",
        resolved,
      });
    } catch {}
  }
  while ((match = WINDOWS_DRIVE_PATH_PATTERN.exec(prompt)) !== null)
    if (match[1]) addPathRef(match[1]);
  while ((match = PATH_PATTERN.exec(prompt)) !== null) if (match[1]) addPathRef(match[1]);
  return refs;
}
/**
 * Resolves and loads one detected image ref into model-ready image content.
 * Sandbox refs must validate through the bridge; non-sandbox refs can resolve
 * media claim-checks and workspace-relative paths before loadWebMedia enforces
 * local-root and size limits.
 */
async function loadImageFromRef(ref, workspaceDir, options) {
  try {
    let targetPath = ref.resolved;
    if (!options?.sandbox) targetPath = await resolveMediaReferenceLocalPath(targetPath);
    if (options?.sandbox)
      try {
        targetPath = (
          await resolveSandboxedBridgeMediaPath({
            sandbox: {
              root: options.sandbox.root,
              bridge: options.sandbox.bridge,
              workspaceOnly: options.workspaceOnly,
            },
            mediaPath: targetPath,
            inboundFallbackDir: "media/inbound",
          })
        ).resolved;
      } catch (err) {
        log.debug(
          `Native image: sandbox validation failed for ${ref.resolved}: ${formatErrorMessage(err)}`,
        );
        return null;
      }
    else if (!path.isAbsolute(targetPath)) targetPath = path.resolve(workspaceDir, targetPath);
    const media = options?.sandbox
      ? await loadWebMedia(targetPath, {
          maxBytes: options.maxBytes,
          sandboxValidated: true,
          readFile: createSandboxBridgeReadFile({ sandbox: options.sandbox }),
        })
      : await loadWebMedia(
          targetPath,
          options?.workspaceOnly
            ? {
                maxBytes: options.maxBytes,
                localRoots: options.localRoots ?? [workspaceDir],
              }
            : options?.maxBytes,
        );
    if (media.kind !== "image") {
      log.debug(`Native image: not an image file: ${targetPath} (got ${media.kind})`);
      return null;
    }
    const mimeType = media.contentType ?? "image/jpeg";
    return {
      type: "image",
      data: media.buffer.toString("base64"),
      mimeType,
    };
  } catch (err) {
    log.debug(`Native image: failed to load ${ref.resolved}: ${formatErrorMessage(err)}`);
    return null;
  }
}
/** Returns whether the resolved model advertises native image input support. */
function modelSupportsImages(model) {
  return model.input?.includes("image") ?? false;
}
/**
 * Detects, loads, orders, and sanitizes the image payload for one prompt turn.
 * Attachment boilerplate is separated from user-authored refs so existing
 * inline images and offloaded claim-check images are not loaded twice.
 */
async function detectAndLoadPromptImages(params) {
  if (!modelSupportsImages(params.model))
    return {
      images: [],
      detectedRefs: [],
      loadedCount: 0,
      skippedCount: 0,
    };
  const allRefs = detectImageReferences(params.prompt);
  if (allRefs.length === 0)
    return {
      images: await sanitizeImagesWithLog(params.existingImages ?? [], "prompt:images", {
        maxDimensionPx: params.maxDimensionPx,
      }),
      detectedRefs: [],
      loadedCount: 0,
      skippedCount: 0,
    };
  log.debug(`Native image: detected ${allRefs.length} image refs in prompt`);
  const { promptRefs, attachmentRefs } = splitPromptAndAttachmentRefs({
    prompt: params.prompt,
    refs: allRefs,
    imageOrder: params.imageOrder,
    existingImageCount: params.existingImages?.length,
  });
  const promptRefImages = [];
  const offloadedImages = [];
  let loadedCount = 0;
  let skippedCount = 0;
  for (const ref of promptRefs) {
    const image = await loadImageFromRef(ref, params.workspaceDir, {
      maxBytes: params.maxBytes,
      workspaceOnly: params.workspaceOnly,
      localRoots: params.localRoots,
      sandbox: params.sandbox,
    });
    if (image) {
      promptRefImages.push(image);
      loadedCount++;
      log.debug(`Native image: loaded ${ref.type} ${ref.resolved}`);
    } else skippedCount++;
  }
  for (const ref of attachmentRefs) {
    const image = await loadImageFromRef(ref, params.workspaceDir, {
      maxBytes: params.maxBytes,
      workspaceOnly: params.workspaceOnly,
      localRoots: params.localRoots,
      sandbox: params.sandbox,
    });
    offloadedImages.push(image);
    if (image) {
      loadedCount++;
      log.debug(`Native image: loaded ${ref.type} ${ref.resolved}`);
    } else skippedCount++;
  }
  return {
    images: await sanitizeImagesWithLog(
      mergePromptAttachmentImages({
        imageOrder: params.imageOrder,
        existingImages: params.existingImages,
        offloadedImages,
        promptRefImages,
      }),
      "prompt:images",
      { maxDimensionPx: params.maxDimensionPx },
    ),
    detectedRefs: allRefs,
    loadedCount,
    skippedCount,
  };
}
//#endregion
export { detectImageReferences as n, loadImageFromRef as r, detectAndLoadPromptImages as t };
