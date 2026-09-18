import { t as parseInlineDirectives } from "./directive-tags-Btb1ssgA.js";
import "./src-Bl7G9qvi.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as parseFenceSpans } from "./fences-rLVnT2kD.js";
import {
  _ as parseLooseIpAddress,
  c as isIpv4Address,
  g as parseCanonicalIpAddress,
  i as isCanonicalDottedDecimalIPv4,
  n as isBlockedSpecialUseIpv4Address,
  r as isBlockedSpecialUseIpv6Address,
  t as extractEmbeddedIpv4FromIpv6,
  u as isLegacyIpv4Literal,
} from "./ip-CyyRxPli.js";
import {
  a as hasReplyPayloadContent,
  c as normalizeInteractiveReply,
  f as renderMessagePresentationChartFallbackText,
  l as normalizeMessagePresentation,
  m as renderMessagePresentationTableFallbackText,
  n as hasMessagePresentationBlocks,
  r as hasReplyChannelData,
  t as hasInteractiveReplyBlocks,
} from "./payload-BFbDi85B.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-DDwHXDkv.js";
import {
  i as isRenderablePayload,
  o as shouldSuppressReasoningPayload,
  r as formatBtwTextForExternalDelivery,
} from "./reply-payloads-CrA6c_P6.js";
import { i as isSilentReplyPayloadText } from "./tokens-DKI4eGAu.js";
import { t as hasHttpUrlPrefix } from "./url-protocol-oWYinajA.js";
//#region src/media/audio-tags.ts
/**
 * Extract audio mode tag from text.
 * Supports [[audio_as_voice]] to send audio as voice message instead of file.
 * Default is file (preserves backward compatibility).
 */
function parseAudioTag(text) {
  const result = parseInlineDirectives(text, { stripReplyTags: false });
  return {
    text: result.text,
    audioAsVoice: result.audioAsVoice,
    hadTag: result.hasAudioTag,
  };
}
//#endregion
//#region src/media/parse.ts
/** Captures legacy MEDIA: attachment directives from model/tool output. */
const MEDIA_TOKEN_RE = /\bMEDIA:\s*`?([^\n]+)`?/gi;
const FILE_URL_PREFIX_RE = /^file:\/\//i;
/** Converts file URLs into plain local paths before downstream media validation. */
function normalizeMediaSource(src) {
  return src.replace(FILE_URL_PREFIX_RE, "");
}
const TRAILING_SERIALIZED_JSON_AFTER_EXT_RE = /^(.*\.\w{1,10})\\?"(?=[\]},:]|$).*/s;
function cleanCandidate(raw) {
  const stripped = raw.replace(/^[`"'[{(]+/, "").replace(/[`"'\\})\],]+$/, "");
  return TRAILING_SERIALIZED_JSON_AFTER_EXT_RE.exec(stripped)?.[1] ?? stripped;
}
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const HAS_FILE_EXT = /\.\w{1,10}$/;
const TRAVERSAL_SEGMENT_RE = /(?:^|[/\\])\.\.(?:[/\\]|$)/;
function isSupportedHomeRelativePath(candidate) {
  return candidate.startsWith("~/") || candidate.startsWith("~\\");
}
function hasTraversalOrUnsupportedHomeDirPrefix(candidate) {
  return (
    candidate.startsWith("../") ||
    candidate === ".." ||
    (candidate.startsWith("~") && !isSupportedHomeRelativePath(candidate)) ||
    TRAVERSAL_SEGMENT_RE.test(candidate)
  );
}
function looksLikeLocalFilePath(candidate) {
  return (
    candidate.startsWith("/") ||
    candidate.startsWith("./") ||
    candidate.startsWith("../") ||
    candidate.startsWith("~") ||
    WINDOWS_DRIVE_RE.test(candidate) ||
    candidate.startsWith("\\\\") ||
    (!SCHEME_RE.test(candidate) && (candidate.includes("/") || candidate.includes("\\")))
  );
}
function isLikelyLocalPath(candidate) {
  if (hasTraversalOrUnsupportedHomeDirPrefix(candidate)) return false;
  return (
    candidate.startsWith("/") ||
    candidate.startsWith("./") ||
    isSupportedHomeRelativePath(candidate) ||
    WINDOWS_DRIVE_RE.test(candidate) ||
    candidate.startsWith("\\\\") ||
    (!SCHEME_RE.test(candidate) && (candidate.includes("/") || candidate.includes("\\")))
  );
}
function normalizeRemoteMediaHostname(value) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.+$/, "");
  if (normalized.split(".").some((label) => label.length === 0)) return "";
  return normalized;
}
function isBlockedRemoteMediaHostname(hostname) {
  const normalized = normalizeRemoteMediaHostname(hostname);
  if (!normalized) return true;
  if (!normalized.includes(".")) return true;
  if (
    normalized === "localhost" ||
    normalized === "localhost.localdomain" ||
    normalized === "metadata.google.internal" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  )
    return true;
  const strictIp = parseCanonicalIpAddress(normalized);
  if (strictIp) {
    if (isIpv4Address(strictIp)) return isBlockedSpecialUseIpv4Address(strictIp);
    if (isBlockedSpecialUseIpv6Address(strictIp)) return true;
    const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(strictIp);
    return embeddedIpv4 ? isBlockedSpecialUseIpv4Address(embeddedIpv4) : false;
  }
  if (normalized.includes(":") && !parseLooseIpAddress(normalized)) return true;
  return !isCanonicalDottedDecimalIPv4(normalized) && isLegacyIpv4Literal(normalized);
}
function isAllowedRemoteMediaUrl(candidate) {
  try {
    const parsed = new URL(candidate);
    return (
      parsed.protocol === "https:" &&
      !parsed.username &&
      !parsed.password &&
      !isBlockedRemoteMediaHostname(parsed.hostname)
    );
  } catch {
    return false;
  }
}
function isValidMedia(candidate, opts) {
  if (!candidate) return false;
  if (candidate.length > 4096) return false;
  if (!opts?.allowSpaces && /\s/.test(candidate)) return false;
  if (hasHttpUrlPrefix(candidate)) return isAllowedRemoteMediaUrl(candidate);
  if (isLikelyLocalPath(candidate)) return true;
  if (hasTraversalOrUnsupportedHomeDirPrefix(candidate)) return false;
  if (opts?.allowBareFilename && !SCHEME_RE.test(candidate) && HAS_FILE_EXT.test(candidate))
    return true;
  return false;
}
function unwrapQuoted(value) {
  const trimmed = value.trim();
  if (trimmed.length < 2) return;
  const first = trimmed[0];
  if (first !== trimmed[trimmed.length - 1]) return;
  if (first !== `"` && first !== "'" && first !== "`") return;
  return trimmed.slice(1, -1).trim();
}
function mayContainFenceMarkers(input) {
  return input.includes("```") || input.includes("~~~");
}
function cleanLineText(text) {
  return text.replace(/[ \t]{2,}/g, " ").trim();
}
const MAX_MARKDOWN_IMAGE_LINE_LENGTH = 2e4;
const MAX_MARKDOWN_IMAGE_ATTEMPTS_PER_LINE = 80;
const MAX_MARKDOWN_IMAGE_MATCHES_PER_LINE = 50;
function findMatchingBracket(input, start, open, close) {
  let depth = 1;
  for (let i = start; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === "\\") {
      i += 1;
      continue;
    }
    if (ch === open) {
      depth += 1;
      continue;
    }
    if (ch !== close) continue;
    depth -= 1;
    if (depth === 0) return i;
  }
}
function isRemoteMarkdownImageMedia(candidate) {
  return hasHttpUrlPrefix(candidate) && isValidMedia(candidate);
}
function parseMarkdownTitle(input, start) {
  let index = start;
  while (index < input.length && /\s/.test(input[index] ?? "")) index += 1;
  const opener = input[index];
  if (!opener) return;
  const closer = opener === '"' || opener === "'" ? opener : opener === "(" ? ")" : null;
  if (!closer) return;
  const closingIndex =
    opener === "("
      ? findMatchingBracket(input, index + 1, "(", ")")
      : (() => {
          for (let i = index + 1; i < input.length; i += 1) {
            const ch = input[i];
            if (ch === "\\") {
              i += 1;
              continue;
            }
            if (ch === closer) return i;
          }
        })();
  if (closingIndex == null) return;
  let tailIndex = closingIndex + 1;
  while (tailIndex < input.length && /\s/.test(input[tailIndex] ?? "")) tailIndex += 1;
  return input[tailIndex] === ")" ? tailIndex + 1 : void 0;
}
function parseMarkdownImageDestination(input, start) {
  let index = start;
  while (index < input.length && /\s/.test(input[index] ?? "")) index += 1;
  if (index >= input.length) return;
  if (input[index] === "<") {
    let closing = index + 1;
    while (closing < input.length) {
      const ch = input[closing];
      if (ch === "\\") {
        closing += 2;
        continue;
      }
      if (ch === ">") {
        const destination = input.slice(index + 1, closing).trim();
        if (!destination) return;
        let tailIndex = closing + 1;
        while (tailIndex < input.length && /\s/.test(input[tailIndex] ?? "")) tailIndex += 1;
        if (input[tailIndex] === ")")
          return {
            destination,
            end: tailIndex + 1,
          };
        const titledEnd = parseMarkdownTitle(input, tailIndex);
        return titledEnd
          ? {
              destination,
              end: titledEnd,
            }
          : void 0;
      }
      closing += 1;
    }
    return;
  }
  const destinationStart = index;
  let destinationEnd = index;
  let parenDepth = 0;
  while (index < input.length) {
    const ch = input.charAt(index);
    if (ch === "\\") {
      index += 2;
      destinationEnd = index;
      continue;
    }
    if (ch === "(") {
      parenDepth += 1;
      index += 1;
      destinationEnd = index;
      continue;
    }
    if (ch === ")") {
      if (parenDepth === 0) {
        const destination = input.slice(destinationStart, destinationEnd).trim();
        return destination
          ? {
              destination,
              end: index + 1,
            }
          : void 0;
      }
      parenDepth -= 1;
      index += 1;
      destinationEnd = index;
      continue;
    }
    if (/\s/.test(ch) && parenDepth === 0) {
      const destination = input.slice(destinationStart, destinationEnd).trim();
      if (!destination) return;
      const titledEnd = parseMarkdownTitle(input, index);
      return titledEnd
        ? {
            destination,
            end: titledEnd,
          }
        : void 0;
    }
    index += 1;
    destinationEnd = index;
  }
}
function findMarkdownImageMatches(line) {
  if (line.length > MAX_MARKDOWN_IMAGE_LINE_LENGTH) return [];
  const matches = [];
  let searchIndex = 0;
  let attempts = 0;
  while (
    matches.length < MAX_MARKDOWN_IMAGE_MATCHES_PER_LINE &&
    attempts < MAX_MARKDOWN_IMAGE_ATTEMPTS_PER_LINE
  ) {
    const index = line.indexOf("![", searchIndex);
    if (index < 0) break;
    attempts += 1;
    const altEnd = findMatchingBracket(line, index + 2, "[", "]");
    if (altEnd == null || line[altEnd + 1] !== "(") {
      searchIndex = index + 2;
      continue;
    }
    const parsed = parseMarkdownImageDestination(line, altEnd + 2);
    if (!parsed) {
      searchIndex = index + 2;
      continue;
    }
    matches.push({
      start: index,
      end: parsed.end,
      destination: parsed.destination,
    });
    searchIndex = parsed.end;
  }
  return matches;
}
function collectMarkdownImageSegments(params) {
  const matches = findMarkdownImageMatches(params.line);
  if (matches.length === 0)
    return {
      lineSegments: [],
      foundMedia: false,
    };
  const segmentPieces = [];
  const visiblePieces = [];
  const lineSegments = [];
  let cursor = 0;
  let foundMedia = false;
  for (const match of matches) {
    const before = params.line.slice(cursor, match.start);
    segmentPieces.push(before);
    visiblePieces.push(before);
    const target = normalizeMediaSource(
      cleanCandidate(unwrapQuoted(match.destination) ?? match.destination),
    );
    if (isRemoteMarkdownImageMedia(target)) {
      const beforeText = cleanLineText(segmentPieces.join(""));
      if (beforeText)
        lineSegments.push({
          type: "text",
          text: beforeText,
        });
      segmentPieces.length = 0;
      params.media.push(target);
      lineSegments.push({
        type: "media",
        url: target,
      });
      foundMedia = true;
    } else {
      const original = params.line.slice(match.start, match.end);
      segmentPieces.push(original);
      visiblePieces.push(original);
    }
    cursor = match.end;
  }
  const after = params.line.slice(cursor);
  segmentPieces.push(after);
  visiblePieces.push(after);
  const trailingText = cleanLineText(segmentPieces.join(""));
  if (trailingText)
    lineSegments.push({
      type: "text",
      text: trailingText,
    });
  return {
    cleanedLine: cleanLineText(visiblePieces.join("")) || void 0,
    lineSegments,
    foundMedia,
  };
}
function isInsideFence(fenceSpans, offset) {
  return fenceSpans.some((span) => offset >= span.start && offset < span.end);
}
/** Splits tool/stdout text into visible text, media attachments, voice tags, and ordered segments. */
function splitMediaFromOutput(raw, options = {}) {
  const trimmedRaw = raw.trimEnd();
  if (!trimmedRaw.trim()) return { text: "" };
  const extractMarkdownImages = options.extractMarkdownImages === true;
  const extractMediaDirectives = options.extractMediaDirectives !== false;
  const mayContainMediaToken = extractMediaDirectives && /media:/i.test(trimmedRaw);
  const mayContainMarkdownImage = extractMarkdownImages && /!\[[^\]]*]\(/.test(trimmedRaw);
  const mayContainAudioTag = trimmedRaw.includes("[[");
  if (!mayContainMediaToken && !mayContainMarkdownImage && !mayContainAudioTag)
    return { text: trimmedRaw };
  const media = [];
  let foundMediaToken = false;
  const segments = [];
  const pushTextSegment = (text) => {
    if (!text) return;
    const last = segments[segments.length - 1];
    if (last?.type === "text") {
      last.text = `${last.text}\n${text}`;
      return;
    }
    segments.push({
      type: "text",
      text,
    });
  };
  const hasFenceMarkers = mayContainFenceMarkers(trimmedRaw);
  const fenceSpans = hasFenceMarkers ? parseFenceSpans(trimmedRaw) : [];
  const lines = trimmedRaw.split("\n");
  const keptLines = [];
  let lineOffset = 0;
  for (const line of lines) {
    if (hasFenceMarkers && isInsideFence(fenceSpans, lineOffset)) {
      keptLines.push(line);
      pushTextSegment(line);
      lineOffset += line.length + 1;
      continue;
    }
    const trimmedStart = line.trimStart();
    if (!extractMediaDirectives || !trimmedStart.toUpperCase().startsWith("MEDIA:")) {
      const markdownImageResult = extractMarkdownImages
        ? collectMarkdownImageSegments({
            line,
            media,
          })
        : {
            lineSegments: [],
            foundMedia: false,
          };
      if (!markdownImageResult.foundMedia) {
        keptLines.push(line);
        pushTextSegment(line);
      } else {
        foundMediaToken = true;
        if (markdownImageResult.cleanedLine) keptLines.push(markdownImageResult.cleanedLine);
        for (const segment of markdownImageResult.lineSegments) {
          if (segment.type === "text") {
            pushTextSegment(segment.text);
            continue;
          }
          segments.push(segment);
        }
      }
      lineOffset += line.length + 1;
      continue;
    }
    const matches = Array.from(line.matchAll(MEDIA_TOKEN_RE));
    if (matches.length === 0) {
      keptLines.push(line);
      pushTextSegment(line);
      lineOffset += line.length + 1;
      continue;
    }
    const pieces = [];
    const lineSegments = [];
    let cursor = 0;
    for (const match of matches) {
      const start = match.index ?? 0;
      pieces.push(line.slice(cursor, start));
      const payload = expectDefined(match[1], "parse regex capture 1");
      const unwrapped = unwrapQuoted(payload);
      const payloadValue = unwrapped ?? payload;
      const parts = unwrapped ? [unwrapped] : payload.split(/\s+/).filter(Boolean);
      const mediaStartIndex = media.length;
      let validCount = 0;
      const invalidParts = [];
      let hasValidMedia = false;
      for (const part of parts) {
        const candidate = normalizeMediaSource(cleanCandidate(part));
        if (isValidMedia(candidate, unwrapped ? { allowSpaces: true } : void 0)) {
          media.push(candidate);
          hasValidMedia = true;
          foundMediaToken = true;
          validCount += 1;
        } else invalidParts.push(part);
      }
      const trimmedPayload = payloadValue.trim();
      const looksLikeLocalPath =
        looksLikeLocalFilePath(trimmedPayload) || FILE_URL_PREFIX_RE.test(trimmedPayload);
      if (
        !unwrapped &&
        validCount === 1 &&
        invalidParts.length > 0 &&
        /\s/.test(payloadValue) &&
        looksLikeLocalPath
      ) {
        const fallback = normalizeMediaSource(cleanCandidate(payloadValue));
        if (isValidMedia(fallback, { allowSpaces: true })) {
          media.splice(mediaStartIndex, media.length - mediaStartIndex, fallback);
          hasValidMedia = true;
          foundMediaToken = true;
          validCount = 1;
          invalidParts.length = 0;
        }
      }
      if (!hasValidMedia && !unwrapped && /\s/.test(payloadValue)) {
        const spacedFallback = normalizeMediaSource(cleanCandidate(payloadValue));
        if (
          isValidMedia(spacedFallback, {
            allowSpaces: true,
            allowBareFilename: true,
          })
        ) {
          media.splice(mediaStartIndex, media.length - mediaStartIndex, spacedFallback);
          hasValidMedia = true;
          foundMediaToken = true;
          validCount = 1;
          invalidParts.length = 0;
        }
      }
      if (!hasValidMedia) {
        const fallback = normalizeMediaSource(cleanCandidate(payloadValue));
        if (
          isValidMedia(fallback, {
            allowSpaces: true,
            allowBareFilename: true,
          })
        ) {
          media.push(fallback);
          hasValidMedia = true;
          foundMediaToken = true;
          invalidParts.length = 0;
        }
      }
      if (hasValidMedia) {
        const beforeText = cleanLineText(pieces.join(""));
        if (beforeText)
          lineSegments.push({
            type: "text",
            text: beforeText,
          });
        pieces.length = 0;
        for (const url of media.slice(mediaStartIndex, mediaStartIndex + validCount))
          lineSegments.push({
            type: "media",
            url,
          });
        if (invalidParts.length > 0) pieces.push(invalidParts.join(" "));
      } else if (looksLikeLocalPath) foundMediaToken = true;
      else pieces.push(match[0]);
      cursor = start + match[0].length;
    }
    pieces.push(line.slice(cursor));
    const cleanedLine = cleanLineText(pieces.join(""));
    if (cleanedLine) {
      keptLines.push(cleanedLine);
      lineSegments.push({
        type: "text",
        text: cleanedLine,
      });
    }
    for (const segment of lineSegments) {
      if (segment.type === "text") {
        pushTextSegment(segment.text);
        continue;
      }
      segments.push(segment);
    }
    lineOffset += line.length + 1;
  }
  let cleanedText = keptLines
    .join("\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
  const audioTagResult = parseAudioTag(cleanedText);
  const hasAudioAsVoice = audioTagResult.audioAsVoice;
  if (audioTagResult.hadTag) cleanedText = audioTagResult.text.replace(/\n{2,}/g, "\n").trim();
  if (media.length === 0) {
    const parsedText = foundMediaToken || hasAudioAsVoice ? cleanedText : trimmedRaw;
    const result = {
      text: parsedText,
      segments: parsedText
        ? [
            {
              type: "text",
              text: parsedText,
            },
          ]
        : [],
    };
    if (hasAudioAsVoice) result.audioAsVoice = true;
    return result;
  }
  return {
    text: cleanedText,
    mediaUrls: media,
    segments:
      segments.length > 0
        ? segments
        : [
            {
              type: "text",
              text: cleanedText,
            },
          ],
    ...(hasAudioAsVoice ? { audioAsVoice: true } : {}),
  };
}
//#endregion
//#region src/auto-reply/reply/reply-directives.ts
/** Parses inline reply directives such as media, reply targets, audio, and silence. */
const REACTION_DIRECTIVE_RE = /\[\[\s*(react|react_to_current)\s*:\s*([^\]\n]+?)\s*\]\]/giu;
function parseReactionDirective(text, currentMessageId) {
  let reaction;
  const cleaned = text.replace(REACTION_DIRECTIVE_RE, (_match, kind, rawEmoji) => {
    const emoji = rawEmoji.trim();
    if (emoji && !reaction) {
      const replyToCurrent = kind.toLowerCase() === "react_to_current";
      reaction = {
        emoji,
        ...(replyToCurrent ? { replyToCurrent: true } : {}),
        ...(replyToCurrent && currentMessageId ? { replyToId: currentMessageId } : {}),
      };
    }
    return "";
  });
  return {
    text: reaction ? cleaned.trimStart() : cleaned,
    reaction,
  };
}
function mergeReactionDirectiveChannelData(channelData, reaction) {
  if (!reaction) return channelData;
  const telegramData =
    channelData?.telegram &&
    typeof channelData.telegram === "object" &&
    !Array.isArray(channelData.telegram)
      ? channelData.telegram
      : {};
  if ("reaction" in telegramData) return channelData;
  return {
    ...channelData,
    telegram: {
      ...telegramData,
      reaction,
    },
  };
}
/** Parses media, reply-target, audio, and silent directives from reply text. */
function parseReplyDirectives(raw, options = {}) {
  const split = splitMediaFromOutput(raw, {
    extractMarkdownImages: options.extractMarkdownImages,
    extractMediaDirectives: options.extractMediaDirectives,
  });
  let text = split.text ?? "";
  const reactionParsed = parseReactionDirective(text, options.currentMessageId);
  text = reactionParsed.text;
  const replyParsed = parseInlineDirectives(text, {
    currentMessageId: options.currentMessageId,
    stripAudioTag: false,
    stripReplyTags: true,
  });
  if (replyParsed.hasReplyTag) text = replyParsed.text;
  const silentToken = options.silentToken ?? "NO_REPLY";
  const isSilent = isSilentReplyPayloadText(text, silentToken);
  if (isSilent) text = "";
  return {
    text,
    mediaUrls: split.mediaUrls,
    reaction: reactionParsed.reaction,
    replyToId: replyParsed.replyToId ?? reactionParsed.reaction?.replyToId,
    replyToCurrent: replyParsed.replyToCurrent || reactionParsed.reaction?.replyToCurrent || void 0,
    replyToTag: replyParsed.hasReplyTag,
    audioAsVoice: split.audioAsVoice,
    isSilent,
  };
}
//#endregion
//#region src/shared/text/citation-control-markers.ts
const UNSUPPORTED_CITATION_CONTROL_MARKER_RE = /cite(?:[^]*)?/g;
const TRAILING_UNSUPPORTED_CITATION_CONTROL_MARKER_RE = /[ \t]*cite(?:[^]*)?(?=\r?\n|$)/g;
/** Removes unsupported model citation-control markers without disturbing normal hard breaks. */
function stripUnsupportedCitationControlMarkers(text) {
  return text
    .replace(TRAILING_UNSUPPORTED_CITATION_CONTROL_MARKER_RE, "")
    .replace(UNSUPPORTED_CITATION_CONTROL_MARKER_RE, "");
}
//#endregion
//#region src/infra/outbound/payloads.ts
function collectBlockMirrorText(blocks, options = {}) {
  const lines = [];
  for (const block of blocks) {
    if (
      (block.type === "text" || (options.includeContext === true && block.type === "context")) &&
      block.text.trim()
    ) {
      lines.push(block.text.trim());
      continue;
    }
    if (block.type === "buttons") {
      for (const button of block.buttons) if (button.label.trim()) lines.push(button.label.trim());
      continue;
    }
    if (block.type === "chart") {
      lines.push(renderMessagePresentationChartFallbackText(block));
      continue;
    }
    if (block.type === "table") {
      lines.push(renderMessagePresentationTableFallbackText(block));
      continue;
    }
    if (block.type === "select") {
      if (block.placeholder?.trim()) lines.push(block.placeholder.trim());
      for (const option of block.options) if (option.label.trim()) lines.push(option.label.trim());
    }
  }
  return lines;
}
function collectPresentationMirrorText(presentation) {
  if (!presentation) return [];
  const lines = [];
  if (presentation.title?.trim()) lines.push(presentation.title.trim());
  lines.push(...collectBlockMirrorText(presentation.blocks, { includeContext: true }));
  return lines;
}
function collectInteractiveMirrorText(interactive) {
  if (!interactive) return [];
  return collectBlockMirrorText(interactive.blocks);
}
function resolveOutboundMirrorText(entry) {
  const text = entry.parts.text.trim() ? entry.parts.text : entry.payload.text;
  const presentation = normalizeMessagePresentation(entry.payload.presentation);
  if (text?.trim())
    return [
      text,
      ...(presentation
        ? collectBlockMirrorText(
            presentation.blocks.filter((block) => block.type === "chart" || block.type === "table"),
          )
        : []),
    ].join("\n");
  const interactive = normalizeInteractiveReply(entry.payload.interactive);
  return [
    ...collectPresentationMirrorText(presentation),
    ...collectInteractiveMirrorText(interactive),
  ].join("\n");
}
function isSuppressedRelayStatusText(text) {
  const normalized = text.trim();
  if (!normalized) return false;
  if (/^no channel reply\.?$/i.test(normalized)) return true;
  if (/^replied in-thread\.?$/i.test(normalized)) return true;
  if (/^replied in #[-\w]+\.?$/i.test(normalized)) return true;
  if (
    /^updated\s+\[[^\]]*wiki\/[^\]]+\](?:\([^)]+\))?(?:\s+with\b[\s\S]*)?(?:\.\s*)?(?:no channel reply\.?)?$/i.test(
      normalized,
    )
  )
    return true;
  return false;
}
function mergeMediaUrls(...lists) {
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const list of lists) {
    if (!list) continue;
    for (const entry of list) {
      const trimmed = entry?.trim();
      if (!trimmed) continue;
      if (seen.has(trimmed)) continue;
      seen.add(trimmed);
      merged.push(trimmed);
    }
  }
  return merged;
}
function createOutboundPayloadPlanEntry(payload, context = {}) {
  if (shouldSuppressReasoningPayload(payload)) return null;
  const parsed = parseReplyDirectives(payload.text ?? "", {
    extractMarkdownImages: context.extractMarkdownImages,
  });
  const explicitMediaUrls = payload.mediaUrls ?? parsed.mediaUrls;
  const explicitMediaUrl = payload.mediaUrl ?? parsed.mediaUrls?.[0];
  const mergedMedia = mergeMediaUrls(
    explicitMediaUrls,
    explicitMediaUrl ? [explicitMediaUrl] : void 0,
  );
  const strippedText = stripUnsupportedCitationControlMarkers(parsed.text ?? "");
  const strippedParsed =
    strippedText === (parsed.text ?? "") ? parsed : parseReplyDirectives(strippedText);
  const parsedText = strippedParsed.text ?? "";
  if (isSuppressedRelayStatusText(parsedText) && mergedMedia.length === 0) return null;
  const isSilent = strippedParsed.isSilent && mergedMedia.length === 0;
  const resolvedMediaUrl = (explicitMediaUrls?.length ?? 0) > 1 ? void 0 : explicitMediaUrl;
  const channelData = mergeReactionDirectiveChannelData(payload.channelData, parsed.reaction);
  const normalizedPayload = {
    ...payload,
    text:
      formatBtwTextForExternalDelivery({
        ...payload,
        text: parsedText,
      }) ?? "",
    mediaUrls: mergedMedia.length ? mergedMedia : void 0,
    mediaUrl: resolvedMediaUrl,
    replyToId: payload.replyToId ?? parsed.replyToId,
    replyToTag: payload.replyToTag || parsed.replyToTag,
    replyToCurrent: payload.replyToCurrent || parsed.replyToCurrent,
    audioAsVoice: Boolean(payload.audioAsVoice || parsed.audioAsVoice),
    ...(channelData ? { channelData } : {}),
  };
  if (!isRenderablePayload(normalizedPayload) && !isSilent) return null;
  const hasChannelData = hasReplyChannelData(normalizedPayload.channelData);
  return {
    payload: normalizedPayload,
    hasPresentation: hasMessagePresentationBlocks(normalizedPayload.presentation),
    hasInteractive: hasInteractiveReplyBlocks(normalizedPayload.interactive),
    hasChannelData,
    isSilent,
  };
}
/** Builds the canonical outbound payload plan shared by delivery projections. */
function createOutboundPayloadPlan(payloads, context = {}) {
  const prepared = [];
  for (const [sourceIndex, payload] of payloads.entries()) {
    const entry = createOutboundPayloadPlanEntry(payload, {
      extractMarkdownImages: context.extractMarkdownImages,
    });
    if (!entry) continue;
    prepared.push({
      ...entry,
      sourceIndex,
    });
  }
  const plan = [];
  for (const entry of prepared)
    if (!entry.isSilent) {
      plan.push({
        sourceIndex: entry.sourceIndex,
        payload: entry.payload,
        parts: resolveSendableOutboundReplyParts(entry.payload),
        hasPresentation: entry.hasPresentation,
        hasInteractive: entry.hasInteractive,
        hasChannelData: entry.hasChannelData,
      });
      continue;
    }
  return plan;
}
/** Projects a payload plan back to normalized reply payloads for delivery. */
function projectOutboundPayloadPlanForDelivery(plan) {
  return plan.map((entry) => entry.payload);
}
/** Projects a payload plan into runtime transport payload summaries. */
function projectOutboundPayloadPlanForOutbound(plan) {
  const normalizedPayloads = [];
  for (const entry of plan) {
    const payload = entry.payload;
    const text = entry.parts.text;
    if (
      !hasReplyPayloadContent(
        {
          ...payload,
          text,
          mediaUrls: entry.parts.mediaUrls,
        },
        {
          hasChannelData: entry.hasChannelData,
          extraContent: payload.location != null,
        },
      )
    )
      continue;
    normalizedPayloads.push({
      text,
      mediaUrls: entry.parts.mediaUrls,
      audioAsVoice: payload.audioAsVoice === true ? true : void 0,
      ...(entry.hasPresentation ? { presentation: payload.presentation } : {}),
      ...(payload.delivery ? { delivery: payload.delivery } : {}),
      ...(entry.hasInteractive ? { interactive: payload.interactive } : {}),
      ...(entry.hasChannelData ? { channelData: payload.channelData } : {}),
      ...(payload.location ? { location: payload.location } : {}),
    });
  }
  return normalizedPayloads;
}
/** Projects a payload plan into JSON-safe envelope/debug payloads. */
function projectOutboundPayloadPlanForJson(plan) {
  const normalized = [];
  for (const entry of plan) {
    const payload = entry.payload;
    normalized.push({
      text: entry.parts.text,
      mediaUrl: payload.mediaUrl ?? null,
      mediaUrls: entry.parts.mediaUrls.length ? entry.parts.mediaUrls : void 0,
      audioAsVoice: payload.audioAsVoice === true ? true : void 0,
      presentation: payload.presentation,
      delivery: payload.delivery,
      interactive: payload.interactive,
      channelData: payload.channelData,
      ...(payload.location ? { location: payload.location } : {}),
    });
  }
  return normalized;
}
/** Projects a payload plan into text/media content for session mirroring. */
function projectOutboundPayloadPlanForMirror(plan) {
  return {
    text: plan
      .map(resolveOutboundMirrorText)
      .filter((text) => Boolean(text))
      .join("\n"),
    mediaUrls: plan.flatMap((entry) => entry.parts.mediaUrls),
  };
}
/** Summarizes one reply payload for channel transport and hook processing. */
function summarizeOutboundPayloadForTransport(payload) {
  const parts = resolveSendableOutboundReplyParts(payload);
  const text = stripUnsupportedCitationControlMarkers(parts.text);
  const strippedSpokenText =
    typeof payload.spokenText === "string"
      ? stripUnsupportedCitationControlMarkers(payload.spokenText)
      : void 0;
  const spokenText = strippedSpokenText?.trim() ? strippedSpokenText : void 0;
  return {
    text,
    mediaUrls: parts.mediaUrls,
    audioAsVoice: payload.audioAsVoice === true ? true : void 0,
    presentation: payload.presentation,
    delivery: payload.delivery,
    interactive: payload.interactive,
    channelData: payload.channelData,
    ...(payload.location ? { location: payload.location } : {}),
    ...(text || !spokenText ? {} : { hookContent: spokenText }),
  };
}
/** Normalizes reply payloads for direct delivery using the shared plan. */
function normalizeReplyPayloadsForDelivery(payloads) {
  return projectOutboundPayloadPlanForDelivery(createOutboundPayloadPlan(payloads));
}
/** Normalizes reply payloads into JSON-safe outbound envelope payloads. */
function normalizeOutboundPayloadsForJson(payloads) {
  return projectOutboundPayloadPlanForJson(createOutboundPayloadPlan(payloads));
}
/** Formats normalized outbound payload text and attachments for logs. */
function formatOutboundPayloadLog(payload) {
  const lines = [];
  if (payload.text) lines.push(payload.text.trimEnd());
  for (const url of payload.mediaUrls) lines.push(`Attachment: ${url}`);
  return lines.join("\n");
}
//#endregion
export {
  projectOutboundPayloadPlanForDelivery as a,
  projectOutboundPayloadPlanForOutbound as c,
  mergeReactionDirectiveChannelData as d,
  parseReplyDirectives as f,
  normalizeReplyPayloadsForDelivery as i,
  summarizeOutboundPayloadForTransport as l,
  formatOutboundPayloadLog as n,
  projectOutboundPayloadPlanForJson as o,
  normalizeOutboundPayloadsForJson as r,
  projectOutboundPayloadPlanForMirror as s,
  createOutboundPayloadPlan as t,
  stripUnsupportedCitationControlMarkers as u,
};
