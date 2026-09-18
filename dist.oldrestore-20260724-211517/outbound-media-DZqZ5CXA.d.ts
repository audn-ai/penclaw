import { t as OutboundMediaAccess } from "./load-options-CQixiFLj.js";
import { r as PluginStateKeyedStore } from "./plugin-state-store.types-xAF7b0j2.js";
import { t as WebMediaResult } from "./web-media-D1aVPCGn.js";
//#region src/plugin-sdk/outbound-media.d.ts
/** Media loading policy used before plugin media is handed to channel delivery. */
type OutboundMediaLoadOptions = {
  /** Maximum allowed media payload size before the load is rejected. */ maxBytes?: number /** Whether callers may load remote URLs, local files, or both. */;
  mediaAccess?: OutboundMediaAccess /** Approved local roots for file/path media; `"any"` disables root restriction. */;
  mediaLocalRoots?:
    | readonly string[]
    | "any" /** Optional local file reader used by tests or plugin-specific filesystem adapters. */;
  mediaReadFile?: (
    filePath: string,
  ) => Promise<Buffer> /** Workspace root used when resolving relative local media paths. */;
  workspaceDir?: string /** Explicit proxy URL forwarded to shared outbound media loading policy. */;
  proxyUrl?: string /** Fetch implementation for remote media loads. */;
  fetchImpl?: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response> /** Extra fetch options merged into remote media requests. */;
  requestInit?: RequestInit /** Allows explicit proxy DNS behavior to be trusted by the media fetch guard. */;
  trustExplicitProxyDns?: boolean;
};
/** Load outbound media from a remote URL or approved local path using the shared web-media policy. */
declare function loadOutboundMediaFromUrl(
  mediaUrl: string,
  options?: OutboundMediaLoadOptions,
): Promise<WebMediaResult>;
type HostedOutboundMediaMetadata = {
  routePath: string;
  token: string;
  contentType?: string;
  expiresAt: number;
  byteLength: number;
};
type HostedOutboundMediaEntry = {
  metadata: HostedOutboundMediaMetadata;
  buffer: Buffer;
};
type HostedOutboundMediaMetaRecord = HostedOutboundMediaMetadata & {
  id: string;
  chunkCount: number;
};
type HostedOutboundMediaChunkRecord = {
  id: string;
  index: number;
  dataBase64: string;
};
type HostedOutboundMediaStore = {
  prepareUrl: (params: {
    mediaUrl: string;
    routePath: string;
    publicBaseUrl: string;
    maxBytes: number;
    proxyUrl?: string;
  }) => Promise<string>;
  read: (id: string, nowMs?: number) => Promise<HostedOutboundMediaEntry | null>;
  delete: (id: string) => Promise<void>;
  cleanupExpired: (nowMs?: number) => Promise<void>;
  clear: () => Promise<void>;
};
type CreateHostedOutboundMediaStoreOptions = {
  metadataStore: PluginStateKeyedStore<HostedOutboundMediaMetaRecord>;
  chunkStore: PluginStateKeyedStore<HostedOutboundMediaChunkRecord>;
  ttlMs: number;
  resolveExpiresAtMs: (ttlMs: number) => number | undefined;
  createId?: () => string;
  createToken?: () => string;
  rawChunkBytes?: number;
  maxEntries?: number;
  maxChunkRows?: number;
  chunkRowsPerEntryBudget?: number;
};
declare function createHostedOutboundMediaStore(
  options: CreateHostedOutboundMediaStoreOptions,
): HostedOutboundMediaStore;
//#endregion
export {
  HostedOutboundMediaMetadata as a,
  createHostedOutboundMediaStore as c,
  HostedOutboundMediaMetaRecord as i,
  loadOutboundMediaFromUrl as l,
  HostedOutboundMediaChunkRecord as n,
  HostedOutboundMediaStore as o,
  HostedOutboundMediaEntry as r,
  OutboundMediaLoadOptions as s,
  CreateHostedOutboundMediaStoreOptions as t,
};
