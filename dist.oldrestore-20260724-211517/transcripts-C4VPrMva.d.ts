import { o as TranscriptSourceProvider } from "./provider-types-BrEVLGDY.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/transcripts/provider-registry.d.ts
/**
 * Transcript source provider registry.
 *
 * Transcript providers are plugin capability providers; this module exposes
 * canonical/alias lookup and keeps direct plugin resolution ahead of map fallback.
 */
/** Normalize transcript source provider ids for registry lookup. */
declare function normalizeTranscriptSourceProviderId(
  providerId: string | undefined,
): string | undefined;
/** List canonical transcript source providers for a config snapshot. */
declare function listTranscriptSourceProviders(cfg?: OpenClawConfig): TranscriptSourceProvider[];
/** Resolve a transcript provider by canonical id or alias. */
declare function getTranscriptSourceProvider(
  providerId: string | undefined,
  cfg?: OpenClawConfig,
): TranscriptSourceProvider | undefined;
//#endregion
export {
  listTranscriptSourceProviders as n,
  normalizeTranscriptSourceProviderId as r,
  getTranscriptSourceProvider as t,
};
