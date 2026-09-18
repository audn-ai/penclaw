import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { n as hasInboundMedia } from "./inbound-media-BABB4m9T.js";
import "./src-Bl7G9qvi.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { l as mimeTypeFromFilePath } from "./mime-BSEMEb3s.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/history-media.ts
const RECENT_HISTORY_IMAGE_TTL_MS = 30 * 6e4;
const RECENT_HISTORY_IMAGE_LIMIT = 4;
function isRemotePath(value) {
  if (/^[a-z]:[\\/]/i.test(value)) return false;
  try {
    return new URL(value).protocol !== "file:";
  } catch {
    return false;
  }
}
function resolveHistoryImageContentType(media) {
  const contentType = normalizeOptionalString(media.contentType);
  if (contentType?.startsWith("image/")) return contentType;
  return mimeTypeFromFilePath(normalizeOptionalString(media.path));
}
function isHistoryImageMedia(media) {
  if (media.kind === "image") return true;
  return Boolean(resolveHistoryImageContentType(media)?.startsWith("image/"));
}
function resolveTimestamp(value) {
  return asFiniteNumber(value);
}
function resolveHistoryEntries(ctx) {
  return Array.isArray(ctx.InboundHistory) ? ctx.InboundHistory : [];
}
function resolveRecentInboundHistoryImages(params) {
  const nowMs = params.nowMs ?? resolveTimestamp(params.ctx.Timestamp) ?? Date.now();
  const ttlMs = params.ttlMs ?? RECENT_HISTORY_IMAGE_TTL_MS;
  const limit = Math.max(0, params.limit ?? RECENT_HISTORY_IMAGE_LIMIT);
  if (limit === 0) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const entries = resolveHistoryEntries(params.ctx);
  for (let index = entries.length - 1; index >= 0 && out.length < limit; index -= 1) {
    const entry = expectDefined(entries[index], "entries entry at index");
    const timestamp = resolveTimestamp(entry?.timestamp);
    if (timestamp === void 0 || Math.abs(nowMs - timestamp) > ttlMs) continue;
    const mediaEntries = Array.isArray(entry.media) ? entry.media : [];
    for (
      let mediaIndex = mediaEntries.length - 1;
      mediaIndex >= 0 && out.length < limit;
      mediaIndex -= 1
    ) {
      const media = mediaEntries[mediaIndex];
      if (!media || !isHistoryImageMedia(media)) continue;
      const mediaPath = normalizeOptionalString(media.path);
      if (!mediaPath || isRemotePath(mediaPath)) continue;
      const contentType = resolveHistoryImageContentType(media);
      if (!contentType?.startsWith("image/")) continue;
      const messageId = normalizeOptionalString(media.messageId) ?? entry.messageId;
      const key = [messageId ?? "", mediaPath].join("\0");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        path: mediaPath,
        contentType,
        sender: entry.sender,
        ...(messageId ? { messageId } : {}),
      });
    }
  }
  return out.toReversed();
}
function appendRecentHistoryImageContext(params) {
  if (params.images.length === 0) return params.promptText;
  const notes = params.images.map((image, index) => {
    const message = image.messageId ? `, message ${image.messageId}` : "";
    return `[Recent image ${index + 1} from ${image.sender}${message}, attached as media.]`;
  });
  return [params.promptText, notes.join("\n")]
    .filter((part) => part.trim().length > 0)
    .join("\n\n");
}
//#endregion
//#region src/auto-reply/reply/agent-turn-attachments.ts
/** Resolves media attachments available to the current agent turn. */
const agentTurnMediaRuntimeLoader = createLazyImportLoader(
  () => import("./dispatch-acp-media.runtime.js"),
);
/** Lazily loads media runtime dependencies for agent-turn attachments. */
function loadAgentTurnMediaRuntime() {
  return agentTurnMediaRuntimeLoader.load();
}
const AGENT_TURN_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
const AGENT_TURN_ATTACHMENT_TIMEOUT_MS = 1e3;
function isImageAgentTurnAttachment(attachment) {
  return attachment.mime?.startsWith("image/") === true;
}
function hasInboundHistoryMedia(ctx) {
  return (
    Array.isArray(ctx.InboundHistory) &&
    ctx.InboundHistory.some((entry) => Array.isArray(entry.media) && entry.media.length > 0)
  );
}
/** Resolves image attachments for the current agent turn and recent image history. */
async function resolveAgentTurnAttachments(params) {
  const includeRecentHistoryImages = params.includeRecentHistoryImages ?? true;
  if (
    !hasInboundMedia(params.ctx) &&
    !(includeRecentHistoryImages && hasInboundHistoryMedia(params.ctx))
  )
    return {
      attachments: [],
      recentHistoryImages: [],
    };
  const runtime = params.runtime ?? (await loadAgentTurnMediaRuntime());
  const currentAttachments = runtime
    .normalizeAttachments(params.ctx)
    .map((attachment) =>
      normalizeOptionalString(attachment.path)
        ? Object.assign({}, attachment, { url: void 0 })
        : attachment,
    );
  const recentHistoryImages = includeRecentHistoryImages
    ? resolveRecentInboundHistoryImages({ ctx: params.ctx })
    : [];
  const firstHistoryAttachmentIndex =
    currentAttachments.reduce(
      (maxIndex, attachment) =>
        Number.isFinite(attachment.index) ? Math.max(maxIndex, attachment.index) : maxIndex,
      -1,
    ) + 1;
  const historyAttachments = recentHistoryImages.map((image, index) => ({
    path: image.path,
    mime: image.contentType,
    index: firstHistoryAttachmentIndex + index,
  }));
  const historyAttachmentByIndex = new Map(
    historyAttachments.map((attachment, index) => [attachment.index, recentHistoryImages[index]]),
  );
  const mediaAttachments = [...currentAttachments, ...historyAttachments];
  const cache = new runtime.MediaAttachmentCache(mediaAttachments, {
    localPathRoots: runtime.resolveMediaAttachmentLocalRoots({
      cfg: params.cfg,
      ctx: params.ctx,
    }),
  });
  const results = [];
  const resultIndexes = [];
  const resolvedHistoryImages = [];
  const resolveImageAttachment = async (attachment) => {
    const mediaType = attachment.mime ?? "application/octet-stream";
    if (!isImageAgentTurnAttachment(attachment)) return false;
    if (!normalizeOptionalString(attachment.path)) return false;
    try {
      const { buffer } = await cache.getBuffer({
        attachmentIndex: attachment.index,
        maxBytes: AGENT_TURN_ATTACHMENT_MAX_BYTES,
        timeoutMs: AGENT_TURN_ATTACHMENT_TIMEOUT_MS,
      });
      results.push({
        mediaType,
        data: buffer.toString("base64"),
      });
      resultIndexes.push(attachment.index);
      const historyImage = historyAttachmentByIndex.get(attachment.index);
      if (historyImage) resolvedHistoryImages.push(historyImage);
      return true;
    } catch (error) {
      if (runtime.isMediaUnderstandingSkipError(error))
        logVerbose(
          `agent-turn-attachments: skipping attachment #${attachment.index + 1} (${error.reason})`,
        );
      else {
        const errorName = error instanceof Error ? error.name : typeof error;
        logVerbose(
          `agent-turn-attachments: failed to read attachment #${attachment.index + 1} (${errorName})`,
        );
      }
      return false;
    }
  };
  let currentImageResolved = false;
  const hasCurrentMedia = currentAttachments.length > 0;
  const hasCurrentImageCandidate = currentAttachments.some(isImageAgentTurnAttachment);
  for (const attachment of currentAttachments)
    currentImageResolved = (await resolveImageAttachment(attachment)) || currentImageResolved;
  if (
    includeRecentHistoryImages &&
    !currentImageResolved &&
    (!hasCurrentMedia || hasCurrentImageCandidate)
  )
    for (const attachment of historyAttachments) await resolveImageAttachment(attachment);
  return {
    attachments: results,
    ...(params.includeAttachmentIndexes ? { attachmentIndexes: resultIndexes } : {}),
    recentHistoryImages: resolvedHistoryImages,
  };
}
/** Converts inline image content into ACP attachment payloads. */
function resolveInlineAgentImageAttachments(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((image) => ({
      mediaType: image.mimeType,
      data: image.data,
    }))
    .filter((image) => image.mediaType.startsWith("image/") && image.data.trim().length > 0);
}
//#endregion
export {
  appendRecentHistoryImageContext as i,
  resolveAgentTurnAttachments as n,
  resolveInlineAgentImageAttachments as r,
  loadAgentTurnMediaRuntime as t,
};
