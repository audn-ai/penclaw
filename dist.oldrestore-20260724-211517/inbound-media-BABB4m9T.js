import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/inbound-media.ts
/** Detects inbound media and audio markers in channel message context. */
function hasNormalizedStringEntry(values) {
  return Array.isArray(values) && values.some((value) => normalizeOptionalString(value));
}
/** Returns true when the context carries current-turn media or sticker data. */
function hasInboundMedia(ctx) {
  return Boolean(
    ctx.StickerMediaIncluded ||
    ctx.Sticker ||
    normalizeOptionalString(ctx.MediaPath) ||
    normalizeOptionalString(ctx.MediaUrl) ||
    hasNormalizedStringEntry(ctx.MediaPaths) ||
    hasNormalizedStringEntry(ctx.MediaUrls) ||
    (Array.isArray(ctx.MediaTypes) && ctx.MediaTypes.length > 0),
  );
}
/** Returns true when current-turn media still needs automatic understanding. */
function hasInboundMediaForUnderstanding(ctx) {
  if (!ctx.SkipStickerMediaUnderstanding) return hasInboundMedia(ctx);
  return [ctx.MediaPaths, ctx.MediaUrls, ctx.MediaTypes].some(
    (values) => Array.isArray(values) && values.length > 1,
  );
}
const AUDIO_PLACEHOLDER_RE = /^<media:audio>(\s*\([^)]*\))?$/i;
const AUDIO_HEADER_RE = /^\[Audio\b/i;
function normalizeMediaType(value) {
  return normalizeOptionalString(value)?.split(";", 1)[0]?.toLowerCase();
}
/** Returns true when media fields or body placeholders indicate inbound audio. */
function hasInboundAudio(ctx) {
  if (
    [
      normalizeMediaType(ctx.MediaType),
      ...(Array.isArray(ctx.MediaTypes)
        ? ctx.MediaTypes.map((type) => normalizeMediaType(type))
        : []),
    ]
      .filter((type) => Boolean(type))
      .some((type) => type === "audio" || type.startsWith("audio/"))
  )
    return true;
  const trimmed = (
    normalizeOptionalString(ctx.BodyForCommands) ??
    normalizeOptionalString(ctx.CommandBody) ??
    normalizeOptionalString(ctx.RawBody) ??
    normalizeOptionalString(ctx.Body) ??
    ""
  ).trim();
  if (!trimmed) return false;
  return AUDIO_PLACEHOLDER_RE.test(trimmed) || AUDIO_HEADER_RE.test(trimmed);
}
//#endregion
export { hasInboundMedia as n, hasInboundMediaForUnderstanding as r, hasInboundAudio as t };
