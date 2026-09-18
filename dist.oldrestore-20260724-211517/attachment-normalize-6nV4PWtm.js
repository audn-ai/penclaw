import { n as estimateBase64DecodedBytes } from "./base64-hBzWwdnH.js";
import { r as MAX_IMAGE_BYTES } from "./constants-Mf57IYS0.js";
import "./src-Bl7G9qvi.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { l as mimeTypeFromFilePath, r as extensionForMime } from "./mime-BSEMEb3s.js";
import { E as sniffMimeFromBase64 } from "./openclaw-tools-DGecpaCF.js";
import { i as deleteMediaBuffer, u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/chat-attachments.ts
const OFFLOAD_THRESHOLD_BYTES = 2e6;
const TEXT_ONLY_OFFLOAD_LIMIT = 10;
const DEFAULT_CHAT_ATTACHMENT_MAX_MB = 20;
async function persistInboundImagesForTranscript(params) {
  const inline = [];
  for (const image of params.images)
    try {
      inline.push(
        await saveMediaBuffer(Buffer.from(image.data, "base64"), image.mimeType, "inbound"),
      );
    } catch (err) {
      params.log.warn(
        `${params.logContext}: failed to persist inbound image (${image.mimeType}): ${formatErrorMessage(err)}`,
      );
    }
  const imageOffloaded = [];
  const nonImageOffloaded = [];
  for (const ref of params.offloadedRefs) {
    const saved = {
      id: ref.id,
      path: ref.path,
      size: ref.sizeBytes,
      contentType: ref.mimeType,
    };
    (ref.mimeType.startsWith("image/") ? imageOffloaded : nonImageOffloaded).push(saved);
  }
  if (params.imageOrder.length === 0) return [...inline, ...imageOffloaded, ...nonImageOffloaded];
  const ordered = [];
  let inlineIndex = 0;
  let offloadedIndex = 0;
  for (const entry of params.imageOrder) {
    const media = entry === "inline" ? inline[inlineIndex++] : imageOffloaded[offloadedIndex++];
    if (media) ordered.push(media);
  }
  ordered.push(
    ...inline.slice(inlineIndex),
    ...imageOffloaded.slice(offloadedIndex),
    ...nonImageOffloaded,
  );
  return ordered;
}
/** Resolve the maximum decoded attachment size accepted for chat image inputs. */
function resolveChatAttachmentMaxBytes(cfg) {
  const configured = cfg.agents?.defaults?.mediaMaxMb;
  return Math.floor(
    (typeof configured === "number" && Number.isFinite(configured) && configured > 0
      ? configured
      : DEFAULT_CHAT_ATTACHMENT_MAX_MB) *
      1024 *
      1024,
  );
}
var UnsupportedAttachmentError = class extends Error {
  constructor(reason, message) {
    super(message);
    this.name = "UnsupportedAttachmentError";
    this.reason = reason;
  }
};
var MediaOffloadError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "MediaOffloadError";
    this.cause = options?.cause;
  }
};
function normalizeMime(mime) {
  if (!mime) return;
  return normalizeOptionalLowercaseString(mime.split(";")[0]) || void 0;
}
function isImageMime(mime) {
  return typeof mime === "string" && mime.startsWith("image/");
}
function isGenericContainerMime(mime) {
  return mime === "application/zip" || mime === "application/octet-stream";
}
function shouldIgnoreImageMimeHint(params) {
  return isGenericContainerMime(params.sniffedMime) && isImageMime(params.hintedMime);
}
function isSpecificMime(mime) {
  return Boolean(mime && !isGenericContainerMime(mime));
}
function resolveAttachmentMime(params) {
  const trustedProvidedMime = shouldIgnoreImageMimeHint({
    sniffedMime: params.sniffedMime,
    hintedMime: params.providedMime,
  })
    ? void 0
    : params.providedMime;
  const trustedLabelMime = shouldIgnoreImageMimeHint({
    sniffedMime: params.sniffedMime,
    hintedMime: params.labelMime,
  })
    ? void 0
    : params.labelMime;
  return (
    (isSpecificMime(params.sniffedMime) && params.sniffedMime) ||
    (isSpecificMime(trustedProvidedMime) && trustedProvidedMime) ||
    (isSpecificMime(trustedLabelMime) && trustedLabelMime) ||
    params.sniffedMime ||
    trustedProvidedMime ||
    trustedLabelMime ||
    "application/octet-stream"
  );
}
function isBase64DataCharCode(code) {
  return (
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    (code >= 48 && code <= 57) ||
    code === 43 ||
    code === 47
  );
}
function isValidBase64(value) {
  if (value.length === 0 || value.length % 4 !== 0) return false;
  let padding = 0;
  let sawPadding = false;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code === 61) {
      padding += 1;
      if (padding > 2) return false;
      sawPadding = true;
      continue;
    }
    if (sawPadding || !isBase64DataCharCode(code)) return false;
  }
  return true;
}
function verifyDecodedSize(buffer, estimatedBytes, label) {
  if (Math.abs(buffer.byteLength - estimatedBytes) > 3)
    throw new Error(
      `attachment ${label}: base64 contains invalid characters (expected ~${estimatedBytes} bytes decoded, got ${buffer.byteLength})`,
    );
}
function ensureExtension(label, mime) {
  if (/\.[a-zA-Z0-9]+$/.test(label)) return label;
  const ext = extensionForMime(mime) ?? "";
  return ext ? `${label}${ext}` : label;
}
function assertSavedMedia(value, label) {
  if (
    value === null ||
    typeof value !== "object" ||
    !("id" in value) ||
    typeof value.id !== "string"
  )
    throw new Error(`attachment ${label}: saveMediaBuffer returned an unexpected shape`);
  const id = value.id;
  if (id.length === 0)
    throw new Error(`attachment ${label}: saveMediaBuffer returned an empty media ID`);
  if (id.includes("/") || id.includes("\\") || id.includes("\0"))
    throw new Error(
      `attachment ${label}: saveMediaBuffer returned an unsafe media ID (contains path separator or null byte)`,
    );
  const path = value.path;
  if (typeof path !== "string" || path.length === 0)
    throw new Error(`attachment ${label}: saveMediaBuffer returned no on-disk path`);
  return {
    id,
    path,
  };
}
function normalizeAttachment(att, idx, opts) {
  const mime = att.mimeType ?? "";
  const content = att.content;
  const label = att.fileName || att.type || `attachment-${idx + 1}`;
  if (typeof content !== "string")
    throw new Error(`attachment ${label}: content must be base64 string`);
  if (opts.requireImageMime && !mime.startsWith("image/"))
    throw new Error(`attachment ${label}: only image/* supported`);
  let base64 = content.trim();
  if (opts.stripDataUrlPrefix) {
    const dataUrlMatch = /^data:[^;]+;base64,(.*)$/.exec(base64);
    if (dataUrlMatch) base64 = expectDefined(dataUrlMatch[1], "data url match capture group 1");
  }
  return {
    label,
    mime,
    base64,
  };
}
async function parseMessageWithAttachments(message, attachments, opts) {
  const maxBytes = opts?.maxBytes ?? DEFAULT_CHAT_ATTACHMENT_MAX_MB * 1024 * 1024;
  const log = opts?.log;
  const shouldForceImageOffload = opts?.supportsImages === false;
  const supportsInlineImages = opts?.supportsInlineImages !== false;
  const acceptNonImage = opts?.acceptNonImage !== false;
  if (!attachments || attachments.length === 0)
    return {
      message,
      images: [],
      imageOrder: [],
      offloadedRefs: [],
    };
  const images = [];
  const imageOrder = [];
  const offloadedRefs = [];
  let updatedMessage = message;
  let textOnlyImageOffloadCount = 0;
  const savedMediaIds = [];
  try {
    for (const [idx, att] of attachments.entries()) {
      if (!att) continue;
      const {
        base64: b64,
        label,
        mime,
      } = normalizeAttachment(att, idx, {
        stripDataUrlPrefix: true,
        requireImageMime: false,
      });
      if (b64.length === 0)
        throw new UnsupportedAttachmentError("empty-payload", `attachment ${label}: empty payload`);
      if (!isValidBase64(b64)) throw new Error(`attachment ${label}: invalid base64 content`);
      const sizeBytes = estimateBase64DecodedBytes(b64);
      if (sizeBytes > maxBytes)
        throw new Error(
          `attachment ${label}: exceeds size limit (${sizeBytes} > ${maxBytes} bytes)`,
        );
      const providedMime = normalizeMime(mime);
      const sniffedMime = normalizeMime(await sniffMimeFromBase64(b64));
      const finalMime = resolveAttachmentMime({
        sniffedMime,
        providedMime,
        labelMime: normalizeMime(mimeTypeFromFilePath(label)),
      });
      if (
        sniffedMime &&
        providedMime &&
        !isGenericContainerMime(providedMime) &&
        sniffedMime !== providedMime
      ) {
        const usedSource =
          finalMime === sniffedMime
            ? "sniffed"
            : finalMime === providedMime
              ? "provided"
              : "label-derived";
        log?.warn(
          `attachment ${label}: mime mismatch (${providedMime} -> ${sniffedMime}), using ${usedSource}`,
        );
      }
      const isImage = isImageMime(finalMime);
      if (isImage && !supportsInlineImages && !shouldForceImageOffload)
        throw new UnsupportedAttachmentError(
          "text-only-image",
          `attachment ${label}: active model does not accept image inputs`,
        );
      if (!isImage && !acceptNonImage)
        throw new UnsupportedAttachmentError(
          "unsupported-non-image",
          `attachment ${label}: non-image attachments (${finalMime}) are not supported on this entrypoint`,
        );
      if (isImage && sizeBytes > 6291456)
        throw new Error(
          `attachment ${label}: image exceeds size limit (${sizeBytes} > ${MAX_IMAGE_BYTES} bytes)`,
        );
      if (
        shouldForceImageOffload &&
        isImage &&
        textOnlyImageOffloadCount >= TEXT_ONLY_OFFLOAD_LIMIT
      ) {
        log?.warn(
          `attachment ${label}: dropping image because text-only offload limit ${TEXT_ONLY_OFFLOAD_LIMIT} was reached`,
        );
        updatedMessage += "\n[image attachment omitted: text-only attachment limit reached]";
        continue;
      }
      if (!(shouldForceImageOffload || !isImage || sizeBytes > OFFLOAD_THRESHOLD_BYTES)) {
        images.push({
          type: "image",
          data: b64,
          mimeType: finalMime,
        });
        imageOrder.push("inline");
        continue;
      }
      const buffer = Buffer.from(b64, "base64");
      verifyDecodedSize(buffer, sizeBytes, label);
      let savedMedia;
      try {
        savedMedia = assertSavedMedia(
          await saveMediaBuffer(
            buffer,
            finalMime,
            "inbound",
            maxBytes,
            ensureExtension(label, finalMime),
          ),
          label,
        );
      } catch (err) {
        throw new MediaOffloadError(
          `[Gateway Error] Failed to save intercepted media to disk: ${formatErrorMessage(err)}`,
          { cause: err },
        );
      }
      savedMediaIds.push(savedMedia.id);
      const mediaRef = `media://inbound/${savedMedia.id}`;
      if (isImage) updatedMessage += `\n[media attached: ${mediaRef}]`;
      log?.info?.(
        shouldForceImageOffload && isImage
          ? `[Gateway] Offloaded image for text-only model. Saved: ${mediaRef}`
          : `[Gateway] Offloaded attachment (${finalMime}). Saved: ${mediaRef}`,
      );
      offloadedRefs.push({
        mediaRef,
        id: savedMedia.id,
        path: savedMedia.path,
        mimeType: finalMime,
        label,
        sizeBytes,
      });
      if (isImage) {
        imageOrder.push("offloaded");
        if (shouldForceImageOffload) textOnlyImageOffloadCount++;
      }
    }
  } catch (err) {
    if (savedMediaIds.length > 0)
      await Promise.allSettled(savedMediaIds.map((id) => deleteMediaBuffer(id, "inbound")));
    throw err;
  }
  return {
    message: updatedMessage !== message ? updatedMessage.trimEnd() : message,
    images,
    imageOrder,
    offloadedRefs,
  };
}
//#endregion
//#region src/gateway/server-methods/attachment-normalize.ts
function normalizeAttachmentContent(content) {
  if (typeof content === "string") return content;
  if (ArrayBuffer.isView(content))
    return Buffer.from(content.buffer, content.byteOffset, content.byteLength).toString("base64");
  if (content instanceof ArrayBuffer) return Buffer.from(content).toString("base64");
}
/** Convert permissive RPC attachment payloads into the bounded chat attachment shape. */
function normalizeRpcAttachmentsToChatAttachments(attachments) {
  return (
    attachments
      ?.map((a) => {
        const sourceRecord = a?.source && typeof a.source === "object" ? a.source : void 0;
        const sourceType = typeof sourceRecord?.type === "string" ? sourceRecord.type : void 0;
        const sourceMimeType =
          typeof sourceRecord?.media_type === "string" ? sourceRecord.media_type : void 0;
        const sourceContent =
          sourceType === "base64" ? normalizeAttachmentContent(sourceRecord?.data) : void 0;
        return {
          type: typeof a?.type === "string" ? a.type : void 0,
          mimeType: typeof a?.mimeType === "string" ? a.mimeType : sourceMimeType,
          fileName: typeof a?.fileName === "string" ? a.fileName : void 0,
          content: normalizeAttachmentContent(a?.content) ?? sourceContent,
        };
      })
      .filter((a) => a.content) ?? []
  );
}
//#endregion
export {
  persistInboundImagesForTranscript as a,
  parseMessageWithAttachments as i,
  MediaOffloadError as n,
  resolveChatAttachmentMaxBytes as o,
  UnsupportedAttachmentError as r,
  normalizeRpcAttachmentsToChatAttachments as t,
};
