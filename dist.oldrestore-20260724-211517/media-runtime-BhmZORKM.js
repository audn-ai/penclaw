import fs from "node:fs/promises";
import { deflateSync } from "node:zlib";
import "./src-Bl7G9qvi.js";
import "./http-body-aoMvQQlg.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { a as chunkText } from "./chunk-DtO_2oor.js";
import { n as sendTranscriptEcho } from "./echo-transcript-DQ8LYf2Y.js";
import "./media-services-Czws84B5.js";
import "./store-BfbXoJVN.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./fetch-BZzOpPxp.js";
import "./local-roots-CgMgS9r2.js";
import "./local-media-access-CbrHQkgr.js";
import "./outbound-attachment-B7sr-r6U.js";
import { a as shouldLogVerbose, r as logVerbose } from "./globals-CNUzHTcU.js";
import "./defaults-uoUCU43g.js";
import "./image-runtime-Bf0M579x.js";
import "./defaults.constants-Ci5WOufw.js";
import { i as getFileExtension, u as normalizeMimeType } from "./mime-BSEMEb3s.js";
import "./qr-image-Uv8eOdmU.js";
import "./qr-terminal-CJg7Nrhm.js";
import "./agent-media-payload-B2wNYTcU.js";
import { x as sendTextMediaPayload } from "./reply-payload-DDwHXDkv.js";
import {
  a as runCapability,
  i as resolveMediaAttachmentLocalRoots,
  o as createMediaAttachmentCache,
  s as normalizeMediaAttachments,
  t as buildProviderRegistry,
} from "./runner-Ck8cKi7W.js";
import { C as isAudioAttachment } from "./runner.entries-BYq5cGUt.js";
import { t as sanitizeForPlainText } from "./sanitize-text-BCxyPW9Z.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/media/audio.ts
/** File extensions accepted by channel voice-message upload paths. */
const VOICE_MESSAGE_AUDIO_EXTENSIONS = /* @__PURE__ */ new Set([
  ".oga",
  ".ogg",
  ".opus",
  ".mp3",
  ".m4a",
]);
/** MIME types compatible with voice-message upload paths. */
const VOICE_MESSAGE_MIME_TYPES = /* @__PURE__ */ new Set([
  "audio/ogg",
  "audio/opus",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
]);
/** Checks whether MIME type or filename is compatible with voice-message delivery. */
function isVoiceMessageCompatibleAudio(opts) {
  const mime = normalizeMimeType(opts.contentType);
  if (mime && VOICE_MESSAGE_MIME_TYPES.has(mime)) return true;
  const fileName = normalizeOptionalString(opts.fileName);
  if (!fileName) return false;
  const ext = getFileExtension(fileName);
  if (!ext) return false;
  return VOICE_MESSAGE_AUDIO_EXTENSIONS.has(ext);
}
/**
 * Backward-compatible alias for voice-message audio compatibility checks.
 *
 * @deprecated Use isVoiceMessageCompatibleAudio.
 */
function isVoiceCompatibleAudio(opts) {
  return isVoiceMessageCompatibleAudio(opts);
}
//#endregion
//#region src/media/png-encode.ts
const CRC_TABLE = (() => {
  const table = /* @__PURE__ */ new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 3988292384 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();
/** Compute CRC32 checksum for a buffer (used in PNG chunk encoding). */
function crc32(buf) {
  let crc = 4294967295;
  for (const byte of buf)
    crc =
      expectDefined(CRC_TABLE[(crc ^ byte) & 255], "crc table entry at (crc ^ byte) & 0xff") ^
      (crc >>> 8);
  return (crc ^ 4294967295) >>> 0;
}
/** Create a PNG chunk with type, data, and CRC. */
function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
/**
 * Writes one RGBA pixel into a width-strided buffer.
 * Out-of-bounds coordinates are ignored so fixture drawing code can clip shapes cheaply.
 */
function fillPixel(buf, x, y, width, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= width) return;
  const idx = (y * width + x) * 4;
  if (idx < 0 || idx + 3 >= buf.length) return;
  buf[idx] = r;
  buf[idx + 1] = g;
  buf[idx + 2] = b;
  buf[idx + 3] = a;
}
function encodePng(buffer, width, height, channels) {
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let row = 0; row < height; row += 1) {
    const rawOffset = row * (stride + 1);
    raw[rawOffset] = 0;
    buffer.copy(raw, rawOffset + 1, row * stride, row * stride + stride);
  }
  const compressed = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = channels === 4 ? 6 : 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}
/** Encodes tightly packed RGB bytes (`width * height * 3`) as a PNG image. */
function encodePngRgb(buffer, width, height) {
  return encodePng(buffer, width, height, 3);
}
/** Encodes tightly packed RGBA bytes (`width * height * 4`) as a PNG image. */
function encodePngRgba(buffer, width, height) {
  return encodePng(buffer, width, height, 4);
}
//#endregion
//#region src/media/temp-files.ts
/** Best-effort temp-file cleanup helper for optional paths from media conversion flows. */
async function unlinkIfExists(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {}
}
//#endregion
//#region src/channels/plugins/media-limits.ts
const MB = 1024 * 1024;
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
function resolveChannelMediaMaxBytes(params) {
  const accountId = normalizeAccountId(params.accountId);
  const channelLimit = params.resolveChannelLimitMb({
    cfg: params.cfg,
    accountId,
  });
  if (channelLimit) return channelLimit * MB;
  if (params.cfg.agents?.defaults?.mediaMaxMb) return params.cfg.agents.defaults.mediaMaxMb * MB;
}
//#endregion
//#region src/media-understanding/audio-transcription-runner.ts
/** Runs the configured audio-understanding pipeline and returns the first transcript output. */
async function runAudioTranscription(params) {
  const attachments = params.attachments ?? normalizeMediaAttachments(params.ctx);
  if (attachments.length === 0)
    return {
      transcript: void 0,
      attachments,
    };
  const providerRegistry = buildProviderRegistry(params.providers, params.cfg);
  const cache = createMediaAttachmentCache(attachments, {
    ...(params.localPathRoots ? { localPathRoots: params.localPathRoots } : {}),
    ssrfPolicy: params.cfg.tools?.web?.fetch?.ssrfPolicy,
  });
  try {
    return {
      transcript:
        (
          await runCapability({
            capability: "audio",
            cfg: params.cfg,
            ctx: params.ctx,
            attachments: cache,
            media: attachments,
            agentDir: params.agentDir,
            providerRegistry,
            config: params.cfg.tools?.media?.audio,
            activeModel: params.activeModel,
          })
        ).outputs
          .find((entry) => entry.kind === "audio.transcription")
          ?.text?.trim() || void 0,
      attachments,
    };
  } finally {
    await cache.cleanup();
  }
}
//#endregion
//#region src/media-understanding/audio-preflight.ts
/**
 * Transcribes the first audio attachment BEFORE mention checking.
 * This allows voice notes to be processed in group chats with requireMention: true.
 * Returns the transcript or undefined if transcription fails or no audio is found.
 */
async function transcribeFirstAudio(params) {
  const { ctx, cfg } = params;
  const audioConfig = cfg.tools?.media?.audio;
  if (audioConfig?.enabled === false) return;
  const attachments = normalizeMediaAttachments(ctx);
  if (!attachments || attachments.length === 0) return;
  const firstAudio = attachments.find(
    (att) => att && isAudioAttachment(att) && !att.alreadyTranscribed,
  );
  if (!firstAudio) return;
  if (shouldLogVerbose())
    logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
  try {
    const { transcript } = await runAudioTranscription({
      ctx,
      cfg,
      attachments,
      agentDir: params.agentDir,
      providers: params.providers,
      activeModel: params.activeModel,
      localPathRoots: resolveMediaAttachmentLocalRoots({
        cfg,
        ctx,
      }),
    });
    if (!transcript) return;
    if (audioConfig?.echoTranscript)
      await sendTranscriptEcho({
        ctx,
        cfg,
        transcript,
        format: audioConfig.echoFormat ?? '📝 "{transcript}"',
      });
    firstAudio.alreadyTranscribed = true;
    if (shouldLogVerbose())
      logVerbose(
        `audio-preflight: transcribed ${transcript.length} chars from attachment ${firstAudio.index}`,
      );
    return transcript;
  } catch (err) {
    if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
    return;
  }
}
//#endregion
//#region src/channels/plugins/outbound/direct-text-media.ts
/**
 * Direct text/media outbound adapter helpers.
 *
 * Builds lightweight SDK-backed send adapters with chunking, sanitization, and media limits.
 */
function asRecord(value) {
  return value != null && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readNumberField(record, key) {
  const value = record?.[key];
  return typeof value === "number" ? value : void 0;
}
/**
 * Resolves an account-scoped channel media byte limit.
 */
function resolveScopedChannelMediaMaxBytes(params) {
  return resolveChannelMediaMaxBytes({
    cfg: params.cfg,
    resolveChannelLimitMb: params.resolveChannelLimitMb,
    accountId: params.accountId,
  });
}
/**
 * Builds a media byte-limit resolver for channels with `mediaMaxMb` config.
 */
function createScopedChannelMediaMaxBytesResolver(channel) {
  return (params) =>
    resolveScopedChannelMediaMaxBytes({
      cfg: params.cfg,
      accountId: params.accountId,
      resolveChannelLimitMb: ({ cfg, accountId }) => {
        const channelConfig = asRecord(cfg.channels?.[channel]);
        return (
          readNumberField(asRecord(asRecord(channelConfig?.accounts)?.[accountId]), "mediaMaxMb") ??
          readNumberField(channelConfig, "mediaMaxMb")
        );
      },
    });
}
/**
 * Creates a channel outbound adapter backed by direct text/media send functions.
 */
function createDirectTextMediaOutbound(params) {
  const sendDirect = async (sendParams) => {
    const send = params.resolveSender(sendParams.deps);
    const maxBytes = params.resolveMaxBytes({
      cfg: sendParams.cfg,
      accountId: sendParams.accountId,
    });
    const result = await send(
      sendParams.to,
      sendParams.text,
      sendParams.buildOptions({
        cfg: sendParams.cfg,
        mediaUrl: sendParams.mediaUrl,
        mediaAccess: sendParams.mediaAccess,
        mediaLocalRoots: sendParams.mediaAccess?.localRoots,
        mediaReadFile: sendParams.mediaAccess?.readFile,
        accountId: sendParams.accountId,
        replyToId: sendParams.replyToId,
        maxBytes,
      }),
    );
    return {
      channel: params.channel,
      ...result,
    };
  };
  const outbound = {
    deliveryMode: "direct",
    chunker: chunkText,
    chunkerMode: "text",
    textChunkLimit: 4e3,
    sanitizeText: ({ text }) => sanitizeForPlainText(text),
    sendPayload: async (ctx) =>
      await sendTextMediaPayload({
        channel: params.channel,
        ctx,
        adapter: outbound,
      }),
    sendText: async ({ cfg, to, text, accountId, deps, replyToId }) => {
      return await sendDirect({
        cfg,
        to,
        text,
        accountId,
        deps,
        replyToId,
        buildOptions: params.buildTextOptions,
      });
    },
    sendMedia: async ({
      cfg,
      to,
      text,
      mediaUrl,
      mediaAccess,
      mediaLocalRoots,
      mediaReadFile,
      accountId,
      deps,
      replyToId,
    }) => {
      return await sendDirect({
        cfg,
        to,
        text,
        mediaUrl,
        mediaAccess:
          mediaAccess ??
          (mediaLocalRoots || mediaReadFile
            ? {
                ...(mediaLocalRoots?.length ? { localRoots: mediaLocalRoots } : {}),
                ...(mediaReadFile ? { readFile: mediaReadFile } : {}),
              }
            : void 0),
        accountId,
        deps,
        replyToId,
        buildOptions: params.buildMediaOptions,
      });
    },
  };
  return outbound;
}
//#endregion
export {
  resolveChannelMediaMaxBytes as a,
  encodePngRgba as c,
  VOICE_MESSAGE_MIME_TYPES as d,
  isVoiceCompatibleAudio as f,
  transcribeFirstAudio as i,
  fillPixel as l,
  createScopedChannelMediaMaxBytesResolver as n,
  unlinkIfExists as o,
  isVoiceMessageCompatibleAudio as p,
  resolveScopedChannelMediaMaxBytes as r,
  encodePngRgb as s,
  createDirectTextMediaOutbound as t,
  VOICE_MESSAGE_AUDIO_EXTENSIONS as u,
};
