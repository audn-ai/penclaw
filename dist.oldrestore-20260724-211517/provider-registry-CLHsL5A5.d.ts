import {
  Gn as SpeechProviderPlugin,
  Rl as TtsDirectiveParseResult,
  Sl as SpeechProviderConfig,
  wl as SpeechProviderId,
  xl as SpeechModelOverridePolicy,
} from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/tts/tts-provider-helpers.d.ts
declare function requireInRange(value: number, min: number, max: number, label: string): void;
declare function normalizeLanguageCode(code?: string): string | undefined;
declare function normalizeApplyTextNormalization(mode?: string): "auto" | "on" | "off" | undefined;
declare function normalizeSeed(seed?: number): number | undefined;
declare function scheduleCleanup(tempDir: string, delayMs?: number): void;
//#endregion
//#region src/tts/directives.d.ts
type ParseTtsDirectiveOptions = {
  cfg?: OpenClawConfig;
  providers?: readonly SpeechProviderPlugin[];
  providerConfigs?: Record<string, SpeechProviderConfig>;
  preferredProviderId?: string;
};
/** Streaming cleaner used to strip TTS tags before final text parsing is available. */
/** Parse TTS directives from final message text, leaving markdown code spans unchanged. */
declare function parseTtsDirectives(
  text: string,
  policy: SpeechModelOverridePolicy,
  options?: ParseTtsDirectiveOptions,
): TtsDirectiveParseResult;
//#endregion
//#region src/tts/provider-registry-core.d.ts
/** Normalize user/provider IDs into the canonical speech provider ID shape. */
declare function normalizeSpeechProviderId(
  providerId: string | undefined,
): SpeechProviderId | undefined;
//#endregion
//#region src/tts/provider-registry.d.ts
/** List configured speech providers using manifest/capability discovery. */
declare const listSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin[];
/** List currently loaded speech providers from the active runtime registry. */
declare const listLoadedSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin[];
/** Resolve a configured speech provider by canonical ID or alias. */
declare const getSpeechProvider: (
  providerId: string | undefined,
  cfg?: OpenClawConfig,
) => SpeechProviderPlugin | undefined;
/** Resolve an input provider ID or alias to the provider's canonical ID. */
declare const canonicalizeSpeechProviderId: (
  providerId: string | undefined,
  cfg?: OpenClawConfig,
) => SpeechProviderId | undefined;
//#endregion
export {
  normalizeSpeechProviderId as a,
  normalizeLanguageCode as c,
  scheduleCleanup as d,
  listSpeechProviders as i,
  normalizeSeed as l,
  getSpeechProvider as n,
  parseTtsDirectives as o,
  listLoadedSpeechProviders as r,
  normalizeApplyTextNormalization as s,
  canonicalizeSpeechProviderId as t,
  requireInRange as u,
};
