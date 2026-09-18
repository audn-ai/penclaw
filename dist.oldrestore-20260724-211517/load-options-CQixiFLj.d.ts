//#region src/media/load-options.d.ts
/** Host callback used to read an already-authorized outbound media file. */
type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;
/** Host-provided file access used when a runtime can read outbound media from local disk. */
type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile /** Agent workspace directory for resolving relative media paths. */;
  workspaceDir?: string;
};
/** Legacy and current knobs accepted by outbound media loaders before normalization. */
type OutboundMediaLoadParams = {
  maxBytes?: number;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[] | "any";
  mediaReadFile?: OutboundMediaReadFile;
  proxyUrl?: string;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  requestInit?: RequestInit;
  trustExplicitProxyDns?: boolean;
  optimizeImages?: boolean /** Agent workspace directory for resolving relative media paths. */;
  workspaceDir?: string;
};
/** Normalized outbound media loader options consumed by fetch/local media helpers. */
type OutboundMediaLoadOptions = {
  maxBytes?: number;
  localRoots?: readonly string[] | "any";
  readFile?: (filePath: string) => Promise<Buffer>;
  proxyUrl?: string;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  requestInit?: RequestInit;
  trustExplicitProxyDns?: boolean;
  hostReadCapability?: boolean;
  optimizeImages?: boolean /** Agent workspace directory for resolving relative media paths. */;
  workspaceDir?: string;
};
/** Normalizes empty root lists while preserving the explicit all-roots opt-in sentinel. */
declare function resolveOutboundMediaLocalRoots(
  mediaLocalRoots?: readonly string[] | "any",
): readonly string[] | "any" | undefined;
/** Collapses legacy read/root parameters into the current host media access shape. */
declare function resolveOutboundMediaAccess(params?: {
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: OutboundMediaReadFile;
}): OutboundMediaAccess | undefined;
/** Builds the canonical media load options shared by outbound attachment paths. */
declare function buildOutboundMediaLoadOptions(
  params?: OutboundMediaLoadParams,
): OutboundMediaLoadOptions;
//#endregion
export {
  buildOutboundMediaLoadOptions as a,
  OutboundMediaReadFile as i,
  OutboundMediaLoadOptions as n,
  resolveOutboundMediaAccess as o,
  OutboundMediaLoadParams as r,
  resolveOutboundMediaLocalRoots as s,
  OutboundMediaAccess as t,
};
