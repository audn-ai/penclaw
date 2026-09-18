import { t as ActiveMediaModel } from "./active-model-Cxn6sQSw.js";
import { t as OutboundMediaAccess } from "./load-options-CQixiFLj.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-Bu7WWq9f.js";
import { t as OutboundSendDeps } from "./send-deps-Ds6JW9s7.js";
import { o as SsrFPolicy } from "./ssrf-skjEI_i5.js";
import { i as MsgContext } from "./templating-h3OQefFR.js";
import {
  c as MediaAttachment,
  d as MediaUnderstandingOutput,
  f as MediaUnderstandingProvider,
  l as MediaUnderstandingCapability$1,
  u as MediaUnderstandingDecision,
} from "./types-Bp5h7fLi.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { mt as MediaUnderstandingConfig } from "./types.slack-DOPma3IJ.js";
//#region src/media/ffmpeg-limits.d.ts
/** Shared stdout/stderr buffer cap for ffmpeg and ffprobe child processes. */
declare const MEDIA_FFMPEG_MAX_BUFFER_BYTES: number;
/** Default ffprobe timeout for lightweight metadata probes. */
declare const MEDIA_FFPROBE_TIMEOUT_MS = 10000;
/** Default ffmpeg timeout for bounded media conversion work. */
declare const MEDIA_FFMPEG_TIMEOUT_MS = 45000;
/** Maximum audio duration accepted by ffmpeg-backed media flows. */
declare const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS: number;
//#endregion
//#region src/media/outbound-attachment.d.ts
/** Loads a remote/local media URL and stages it into the outbound media store. */
declare function resolveOutboundAttachmentFromUrl(
  mediaUrl: string,
  maxBytes: number,
  options?: {
    mediaAccess?: OutboundMediaAccess;
    localRoots?: readonly string[];
    readFile?: (filePath: string) => Promise<Buffer>;
  },
): Promise<{
  path: string;
  contentType?: string;
}>;
/** Stages an in-memory attachment buffer into the outbound media store. */
declare function resolveOutboundAttachmentFromBuffer(
  buffer: Buffer,
  maxBytes: number,
  options?: {
    contentType?: string;
    filename?: string;
  },
): Promise<{
  path: string;
  contentType?: string;
}>;
//#endregion
//#region src/media/png-encode.d.ts
/**
 * Writes one RGBA pixel into a width-strided buffer.
 * Out-of-bounds coordinates are ignored so fixture drawing code can clip shapes cheaply.
 */
declare function fillPixel(
  buf: Buffer,
  x: number,
  y: number,
  width: number,
  r: number,
  g: number,
  b: number,
  a?: number,
): void;
/** Encodes tightly packed RGB bytes (`width * height * 3`) as a PNG image. */
declare function encodePngRgb(buffer: Buffer, width: number, height: number): Buffer;
/** Encodes tightly packed RGBA bytes (`width * height * 4`) as a PNG image. */
declare function encodePngRgba(buffer: Buffer, width: number, height: number): Buffer;
//#endregion
//#region src/media/qr-image.d.ts
type QrPngRenderOptions = {
  scale?: number;
  marginModules?: number;
};
/** Temp-file write options kept to filename segments so callers cannot choose parent paths. */
type QrPngTempFileOptions = QrPngRenderOptions & {
  tmpRoot: string;
  dirPrefix: string;
  fileName?: string;
};
type QrPngTempFile = {
  filePath: string;
  dirPath: string;
  mediaLocalRoots: string[];
};
/** Renders QR text as raw PNG base64 after validating bounded renderer options. */
declare function renderQrPngBase64(input: string, opts?: QrPngRenderOptions): Promise<string>;
/** Wraps PNG base64 in the exact data URL prefix expected by chat/media callers. */
declare function formatQrPngDataUrl(base64: string): string;
/** Renders QR text as a PNG data URL. */
declare function renderQrPngDataUrl(input: string, opts?: QrPngRenderOptions): Promise<string>;
/** Writes QR PNG output into a scoped temp directory and returns that directory as a media root. */
declare function writeQrPngTempFile(
  input: string,
  opts: QrPngTempFileOptions,
): Promise<QrPngTempFile>;
//#endregion
//#region src/media/qr-terminal.d.ts
/** Renders QR text for terminal display, with an optional compact half-block mode. */
declare function renderQrTerminal(
  input: string,
  opts?: {
    small?: boolean;
  },
): Promise<string>;
//#endregion
//#region src/media/temp-files.d.ts
/** Best-effort temp-file cleanup helper for optional paths from media conversion flows. */
declare function unlinkIfExists(filePath: string | null | undefined): Promise<void>;
//#endregion
//#region src/channels/plugins/media-limits.d.ts
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
declare function resolveChannelMediaMaxBytes(params: {
  cfg: OpenClawConfig;
  resolveChannelLimitMb: (params: { cfg: OpenClawConfig; accountId: string }) => number | undefined;
  accountId?: string | null;
}): number | undefined;
//#endregion
//#region src/media-understanding/audio-preflight.d.ts
/**
 * Transcribes the first audio attachment BEFORE mention checking.
 * This allows voice notes to be processed in group chats with requireMention: true.
 * Returns the transcript or undefined if transcription fails or no audio is found.
 */
declare function transcribeFirstAudio(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  agentDir?: string;
  providers?: Record<string, MediaUnderstandingProvider>;
  activeModel?: ActiveMediaModel;
}): Promise<string | undefined>;
//#endregion
//#region packages/media-understanding-common/src/types.d.ts
/** Capability exposed by a media-understanding provider. */
type MediaUnderstandingCapability = "image" | "audio" | "video";
//#endregion
//#region packages/media-understanding-common/src/defaults.d.ts
/** Default max response characters for bounded text outputs. */
declare const DEFAULT_MAX_CHARS = 500;
/** Default max response characters by capability. */
declare const DEFAULT_MAX_CHARS_BY_CAPABILITY: Record<
  MediaUnderstandingCapability,
  number | undefined
>;
/** Default input byte limits by capability. */
declare const DEFAULT_MAX_BYTES: Record<MediaUnderstandingCapability, number>;
/** Default request timeout by capability. */
declare const DEFAULT_TIMEOUT_SECONDS: Record<MediaUnderstandingCapability, number>;
/** Default prompts by capability. */
declare const DEFAULT_PROMPT: Record<MediaUnderstandingCapability, string>;
/** Upper bound for base64-expanded video payloads. */
declare const DEFAULT_VIDEO_MAX_BASE64_BYTES: number;
/** CLI output buffer used by provider child processes. */
declare const CLI_OUTPUT_MAX_BUFFER: number;
/** Default parallel media-understanding request count. */
declare const DEFAULT_MEDIA_CONCURRENCY = 2;
/** Minimum bytes for audio files before transcription is attempted. */
declare const MIN_AUDIO_FILE_BYTES = 1024;
//#endregion
//#region src/media-understanding/defaults.d.ts
/** Resolves the default provider model for a media capability from config or manifest metadata. */
declare function resolveDefaultMediaModel(params: {
  providerId: string;
  capability: MediaUnderstandingCapability$1;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
  includeConfiguredImageModels?: boolean;
}): string | undefined;
/** Resolves auto-discovery provider order for a media capability using manifest priorities. */
declare function resolveAutoMediaKeyProviders(params: {
  capability: MediaUnderstandingCapability$1;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string[];
/** Returns whether provider metadata declares native PDF document input support. */
declare function providerSupportsNativePdfDocument(params: {
  providerId: string;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): boolean;
/** Resolves provider-specific document model hints, preserving explicit unsupported markers. */
declare function resolveDocumentMediaModel(params: {
  providerId: string;
  document: "pdf";
  mode: "textExtraction" | "image";
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string | false | undefined;
//#endregion
//#region src/media-understanding/attachments.cache.d.ts
type MediaBufferResult = {
  buffer: Buffer;
  mime?: string;
  fileName: string;
  size: number;
};
type MediaPathResult = {
  path: string;
  cleanup?: () => Promise<void> | void;
};
/** Local/remote access policy used by the lazy media-understanding attachment cache. */
type MediaAttachmentCacheOptions = {
  localPathRoots?: readonly string[];
  includeDefaultLocalPathRoots?: boolean;
  ssrfPolicy?: SsrFPolicy;
  workspaceDir?: string;
};
/**
 * Lazy resolver for media-understanding attachments.
 *
 * The cache prefers allowed local paths, falls back to remote URLs when a local path is blocked
 * or missing, and owns any temporary files created for providers that require a filesystem path.
 */
declare class MediaAttachmentCache {
  private readonly entries;
  private readonly attachments;
  private readonly localPathRoots;
  private readonly ssrfPolicy;
  private readonly workspaceDir?;
  private canonicalLocalPathRoots?;
  constructor(attachments: MediaAttachment[], options?: MediaAttachmentCacheOptions);
  /** Returns attachment bytes, MIME hint, filename, and size within the requested byte limit. */
  getBuffer(params: {
    attachmentIndex: number;
    maxBytes: number;
    timeoutMs: number;
  }): Promise<MediaBufferResult>;
  /** Returns a local path for providers that cannot accept buffers, creating a temp file if needed. */
  getPath(params: {
    attachmentIndex: number;
    maxBytes?: number;
    timeoutMs: number;
  }): Promise<MediaPathResult>;
  /** Removes temporary files created by `getPath`; callers should run this after provider use. */
  cleanup(): Promise<void>;
  private ensureEntry;
  private resolveLocalPath;
  private ensureLocalStat;
  private getCanonicalLocalPathRoots;
  private readLocalBuffer;
}
//#endregion
//#region src/media-understanding/runner.attachments.d.ts
/** Normalizes message context media fields for the media-understanding runner. */
declare function normalizeMediaAttachments(ctx: MsgContext): MediaAttachment[];
/** Creates the lazy attachment cache used by image, audio, video, and document providers. */
declare function createMediaAttachmentCache(
  attachments: MediaAttachment[],
  options?: MediaAttachmentCacheOptions,
): MediaAttachmentCache;
//#endregion
//#region src/media-understanding/runner.d.ts
type ProviderRegistry = Map<string, MediaUnderstandingProvider>;
type RunCapabilityResult = {
  outputs: MediaUnderstandingOutput[];
  decision: MediaUnderstandingDecision;
};
declare function buildProviderRegistry(
  overrides?: Record<string, MediaUnderstandingProvider>,
  cfg?: OpenClawConfig,
): ProviderRegistry;
declare function resolveMediaAttachmentLocalRoots(params: {
  cfg: OpenClawConfig;
  ctx: MsgContext;
  workspaceDir?: string;
}): readonly string[];
declare function clearMediaUnderstandingBinaryCacheForTests(): void;
declare function resolveAutoImageModel(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  activeModel?: ActiveMediaModel;
}): Promise<ActiveMediaModel | null>;
declare function runCapability(params: {
  capability: MediaUnderstandingCapability$1;
  cfg: OpenClawConfig;
  ctx: MsgContext;
  attachments: MediaAttachmentCache;
  media: MediaAttachment[];
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  providerRegistry: ProviderRegistry;
  config?: MediaUnderstandingConfig;
  activeModel?: ActiveMediaModel;
}): Promise<RunCapabilityResult>;
//#endregion
//#region packages/media-understanding-common/src/provider-id.d.ts
/** Normalize provider aliases to canonical config provider ids. */
declare function normalizeMediaProviderId(id: string): string;
//#endregion
//#region src/channels/plugins/outbound/direct-text-media.d.ts
type DirectSendOptions = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  replyToId?: string | null;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  maxBytes?: number;
};
type DirectSendResult = {
  messageId: string;
  [key: string]: unknown;
};
type DirectSendFn<TOpts extends Record<string, unknown>, TResult extends DirectSendResult> = (
  to: string,
  text: string,
  opts: TOpts,
) => Promise<TResult>;
/**
 * Resolves an account-scoped channel media byte limit.
 */
declare function resolveScopedChannelMediaMaxBytes(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  resolveChannelLimitMb: (params: { cfg: OpenClawConfig; accountId: string }) => number | undefined;
}): number | undefined;
/**
 * Builds a media byte-limit resolver for channels with `mediaMaxMb` config.
 */
declare function createScopedChannelMediaMaxBytesResolver(
  channel: string,
): (params: { cfg: OpenClawConfig; accountId?: string | null }) => number | undefined;
/**
 * Creates a channel outbound adapter backed by direct text/media send functions.
 */
declare function createDirectTextMediaOutbound<
  TOpts extends Record<string, unknown>,
  TResult extends DirectSendResult,
>(params: {
  channel: string;
  resolveSender: (deps: OutboundSendDeps | undefined) => DirectSendFn<TOpts, TResult>;
  resolveMaxBytes: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => number | undefined;
  buildTextOptions: (params: DirectSendOptions) => TOpts;
  buildMediaOptions: (params: DirectSendOptions) => TOpts;
}): ChannelOutboundAdapter;
//#endregion
export {
  formatQrPngDataUrl as A,
  MEDIA_FFMPEG_MAX_BUFFER_BYTES as B,
  DEFAULT_TIMEOUT_SECONDS as C,
  resolveChannelMediaMaxBytes as D,
  transcribeFirstAudio as E,
  encodePngRgba as F,
  MEDIA_FFPROBE_TIMEOUT_MS as H,
  fillPixel as I,
  resolveOutboundAttachmentFromBuffer as L,
  renderQrPngDataUrl as M,
  writeQrPngTempFile as N,
  unlinkIfExists as O,
  encodePngRgb as P,
  resolveOutboundAttachmentFromUrl as R,
  DEFAULT_PROMPT as S,
  MIN_AUDIO_FILE_BYTES as T,
  MEDIA_FFMPEG_TIMEOUT_MS as V,
  CLI_OUTPUT_MAX_BUFFER as _,
  RunCapabilityResult as a,
  DEFAULT_MAX_CHARS_BY_CAPABILITY as b,
  resolveAutoImageModel as c,
  createMediaAttachmentCache as d,
  normalizeMediaAttachments as f,
  resolveDocumentMediaModel as g,
  resolveDefaultMediaModel as h,
  normalizeMediaProviderId as i,
  renderQrPngBase64 as j,
  renderQrTerminal as k,
  resolveMediaAttachmentLocalRoots as l,
  resolveAutoMediaKeyProviders as m,
  createScopedChannelMediaMaxBytesResolver as n,
  buildProviderRegistry as o,
  providerSupportsNativePdfDocument as p,
  resolveScopedChannelMediaMaxBytes as r,
  clearMediaUnderstandingBinaryCacheForTests as s,
  createDirectTextMediaOutbound as t,
  runCapability as u,
  DEFAULT_MAX_BYTES as v,
  DEFAULT_VIDEO_MAX_BASE64_BYTES as w,
  DEFAULT_MEDIA_CONCURRENCY as x,
  DEFAULT_MAX_CHARS as y,
  MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS as z,
};
