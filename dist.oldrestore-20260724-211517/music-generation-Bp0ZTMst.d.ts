import { t as GeneratedMusicAsset } from "./types-nag6eG01.js";

//#region src/music-generation/provider-assets.d.ts
/**
 * Asset extraction and download helpers for music generation providers.
 *
 * Providers may return audio as URLs, file objects, or base64 payloads; these
 * helpers normalize those shapes into bounded in-memory GeneratedMusicAsset values.
 */
/** Candidate audio file returned by a provider before download. */
type GeneratedMusicFileCandidate = {
  url: string;
  mimeType?: string;
  fileName?: string;
};
/** Extract URL/file candidates from common provider response keys. */
declare function extractGeneratedMusicFileCandidates(
  payload: unknown,
  keys?: readonly string[],
): GeneratedMusicFileCandidate[];
/** Convert a base64 provider payload into a generated music asset. */
declare function generatedMusicAssetFromBase64(params: {
  base64: string;
  mimeType: string;
  index?: number;
  fileName?: string;
}): GeneratedMusicAsset;
/** Download a generated music URL with size limits and inferred audio metadata. */
declare function downloadGeneratedMusicAsset(params: {
  candidate: GeneratedMusicFileCandidate;
  timeoutMs: number;
  fetchFn: typeof fetch;
  provider: string;
  requestFailedMessage: string;
  index?: number;
  maxBytes?: number;
}): Promise<GeneratedMusicAsset>;
//#endregion
export {
  generatedMusicAssetFromBase64 as i,
  downloadGeneratedMusicAsset as n,
  extractGeneratedMusicFileCandidates as r,
  GeneratedMusicFileCandidate as t,
};
