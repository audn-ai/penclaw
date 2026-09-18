import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "../base64-hBzWwdnH.js";
import {
  a as maxBytesForKind,
  i as MAX_VIDEO_BYTES,
  n as MAX_DOCUMENT_BYTES,
  o as mediaKindFromMime,
  r as MAX_IMAGE_BYTES,
  t as MAX_AUDIO_BYTES,
} from "../constants-Mf57IYS0.js";
import { t as parseMediaContentLength } from "../content-length-CHOuQ9D3.js";
import {
  n as extnameFromAnyPath,
  r as nameFromAnyPath,
  t as basenameFromAnyPath,
} from "../file-name-D1nUHSBH.js";
import {
  i as normalizeInboundPathRoots,
  n as isValidInboundPathRootPattern,
  r as mergeInboundPathRoots,
  t as isInboundPathAllowed,
} from "../inbound-path-policy-CH_uJYn5.js";
import {
  a as sniffInlineImageMime,
  i as sanitizeInlineImageDataUrlForStorage,
  n as sanitizeInlineImageBase64,
  r as sanitizeInlineImageDataUrl,
  t as INLINE_IMAGE_DATA_URL_PREFIX,
} from "../inline-image-data-url-oC-MoRLP.js";
import { t as isPassThroughRemoteMediaSource } from "../media-source-url-BL9SUd7E.js";
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
} from "../mime-BSEMEb3s.js";
import { t as readByteStreamWithLimit } from "../read-byte-stream-with-limit-BIgLW6Dz.js";
export {
  FILE_TYPE_SNIFF_MAX_BYTES,
  INLINE_IMAGE_DATA_URL_PREFIX,
  MAX_AUDIO_BYTES,
  MAX_DOCUMENT_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
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
