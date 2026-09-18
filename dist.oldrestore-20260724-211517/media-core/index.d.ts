import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "../base64-DyL4sNuh.js";
import {
  a as MediaKind,
  i as MAX_VIDEO_BYTES,
  n as MAX_DOCUMENT_BYTES,
  o as maxBytesForKind,
  r as MAX_IMAGE_BYTES,
  s as mediaKindFromMime,
  t as MAX_AUDIO_BYTES,
} from "../constants-DUpDbaN0.js";
import { t as parseMediaContentLength } from "../content-length--tZ1hXxY.js";
import {
  n as extnameFromAnyPath,
  r as nameFromAnyPath,
  t as basenameFromAnyPath,
} from "../file-name-DC0YXsqY.js";
import {
  i as normalizeInboundPathRoots,
  n as isValidInboundPathRootPattern,
  r as mergeInboundPathRoots,
  t as isInboundPathAllowed,
} from "../inbound-path-policy-nRJfbQMX.js";
import {
  a as sanitizeInlineImageDataUrlForStorage,
  i as sanitizeInlineImageDataUrl,
  n as SanitizedInlineImageBase64,
  o as sniffInlineImageMime,
  r as sanitizeInlineImageBase64,
  t as INLINE_IMAGE_DATA_URL_PREFIX,
} from "../inline-image-data-url-WSc28jV2.js";
import { t as isPassThroughRemoteMediaSource } from "../media-source-url-BV97tmmT.js";
import {
  a as imageMimeFromFormat,
  c as kindFromMime,
  d as sliceMimeSniffBuffer,
  i as getFileExtension,
  l as mimeTypeFromFilePath,
  n as detectMime,
  o as isAudioFileName,
  r as extensionForMime,
  s as isGifMedia,
  t as FILE_TYPE_SNIFF_MAX_BYTES,
  u as normalizeMimeType,
} from "../mime-B6baDqNM.js";
import {
  n as ReadByteStreamWithLimitOptions,
  r as readByteStreamWithLimit,
  t as ByteStreamLimitOverflow,
} from "../read-byte-stream-with-limit-__rHn6Wt.js";
export {
  ByteStreamLimitOverflow,
  FILE_TYPE_SNIFF_MAX_BYTES,
  INLINE_IMAGE_DATA_URL_PREFIX,
  MAX_AUDIO_BYTES,
  MAX_DOCUMENT_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  MediaKind,
  ReadByteStreamWithLimitOptions,
  SanitizedInlineImageBase64,
  basenameFromAnyPath,
  canonicalizeBase64,
  detectMime,
  estimateBase64DecodedBytes,
  extensionForMime,
  extnameFromAnyPath,
  getFileExtension,
  imageMimeFromFormat,
  isAudioFileName,
  isGifMedia,
  isInboundPathAllowed,
  isPassThroughRemoteMediaSource,
  isValidInboundPathRootPattern,
  kindFromMime,
  maxBytesForKind,
  mediaKindFromMime,
  mergeInboundPathRoots,
  mimeTypeFromFilePath,
  nameFromAnyPath,
  normalizeInboundPathRoots,
  normalizeMimeType,
  parseMediaContentLength,
  readByteStreamWithLimit,
  sanitizeInlineImageBase64,
  sanitizeInlineImageDataUrl,
  sanitizeInlineImageDataUrlForStorage,
  sliceMimeSniffBuffer,
  sniffInlineImageMime,
};
