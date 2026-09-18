import { o as parseTtsDirectives } from "./provider-registry-CLHsL5A5.js";
import { r as ReplyPayload } from "./reply-payload-D9hNZyN3.js";
import { n as summarizeText } from "./speech-core-BF13Y27a.js";
import {
  Il as SpeechVoiceOption,
  Ll as TtsDirectiveOverrides,
  Sl as SpeechProviderConfig,
  fl as ResolvedTtsConfig,
  ml as TtsConfigResolutionContext,
  pl as ResolvedTtsModelOverrides,
} from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import {
  G as TtsAutoMode,
  J as TtsModelOverrideConfig,
  Q as TtsProvider,
  W as ResolvedTtsPersona,
} from "./types.slack-DOPma3IJ.js";

//#region packages/speech-core/src/tts.d.ts
type TtsAttemptReasonCode =
  | "success"
  | "no_provider_registered"
  | "not_configured"
  | "unsupported_for_streaming"
  | "unsupported_for_telephony"
  | "timeout"
  | "provider_error";
type TtsProviderAttempt = {
  provider: string;
  outcome: "success" | "skipped" | "failed";
  reasonCode: TtsAttemptReasonCode;
  persona?: string;
  personaBinding?: "applied" | "missing" | "none";
  latencyMs?: number;
  error?: string;
};
type TtsResult = {
  success: boolean;
  audioPath?: string;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  audioAsVoice?: boolean;
  target?: "audio-file" | "voice-note";
};
type TtsSynthesisResult = {
  success: boolean;
  audioBuffer?: Buffer;
  error?: string;
  latencyMs?: number;
  provider?: string;
  providerModel?: string;
  providerVoice?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  fileExtension?: string;
  target?: "audio-file" | "voice-note";
};
type TtsStreamResult = {
  success: boolean;
  audioStream?: ReadableStream<Uint8Array>;
  error?: string;
  latencyMs?: number;
  provider?: string;
  providerModel?: string;
  providerVoice?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  fileExtension?: string;
  target?: "audio-file" | "voice-note";
  release?: () => Promise<void>;
};
type TtsSynthesisStreamResult = TtsStreamResult;
type TtsTelephonyResult = {
  success: boolean;
  audioBuffer?: Buffer;
  error?: string;
  latencyMs?: number;
  provider?: string;
  providerModel?: string;
  providerVoice?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  sampleRate?: number;
};
type TtsStatusEntry = {
  timestamp: number;
  success: boolean;
  textLength: number;
  summarized: boolean;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  latencyMs?: number;
  error?: string;
};
declare function resolveModelOverridePolicy(
  overrides: TtsModelOverrideConfig | undefined,
): ResolvedTtsModelOverrides;
declare function getResolvedSpeechProviderConfig(
  config: ResolvedTtsConfig,
  providerId: string,
  cfg?: OpenClawConfig,
): SpeechProviderConfig;
declare function resolveTtsConfig(
  cfgInput: OpenClawConfig,
  contextOrAgentId?: string | TtsConfigResolutionContext,
): ResolvedTtsConfig;
declare function resolveTtsPrefsPath(config: ResolvedTtsConfig): string;
declare function resolveTtsAutoMode(params: {
  config: ResolvedTtsConfig;
  prefsPath: string;
  sessionAuto?: string;
}): TtsAutoMode;
declare function buildTtsSystemPromptHint(
  cfgInput: OpenClawConfig,
  agentId?: string,
): string | undefined;
declare function isTtsEnabled(
  config: ResolvedTtsConfig,
  prefsPath: string,
  sessionAuto?: string,
): boolean;
declare function setTtsAutoMode(prefsPath: string, mode: TtsAutoMode): void;
declare function setTtsEnabled(prefsPath: string, enabled: boolean): void;
declare function getTtsProvider(config: ResolvedTtsConfig, prefsPath: string): TtsProvider;
declare function getTtsPersona(
  config: ResolvedTtsConfig,
  prefsPath: string,
): ResolvedTtsPersona | undefined;
declare function listTtsPersonas(config: ResolvedTtsConfig): ResolvedTtsPersona[];
declare function setTtsPersona(prefsPath: string, persona: string | null | undefined): void;
declare function setTtsProvider(prefsPath: string, provider: TtsProvider): void;
declare function resolveExplicitTtsOverrides(params: {
  cfg: OpenClawConfig;
  prefsPath?: string;
  provider?: string;
  modelId?: string;
  voiceId?: string;
  agentId?: string;
  channelId?: string;
  accountId?: string;
}): TtsDirectiveOverrides;
declare function getTtsMaxLength(prefsPath: string): number;
declare function setTtsMaxLength(prefsPath: string, maxLength: number): void;
declare function isSummarizationEnabled(prefsPath: string): boolean;
declare function setSummarizationEnabled(prefsPath: string, enabled: boolean): void;
declare function getLastTtsAttempt(): TtsStatusEntry | undefined;
declare function setLastTtsAttempt(entry: TtsStatusEntry | undefined): void;
declare function supportsNativeVoiceNoteTts(channel: string | undefined): boolean;
declare function supportsTranscodedVoiceNoteTts(channel: string | undefined): boolean;
declare function resolveTtsSynthesisTarget(
  channel: string | undefined,
): "audio-file" | "voice-note";
declare function shouldDeliverTtsAsVoice(params: {
  channel: string | undefined;
  target: "audio-file" | "voice-note" | undefined;
  voiceCompatible: boolean | undefined;
  fileExtension?: string;
  outputFormat?: string;
}): boolean;
declare function resolveTtsProviderOrder(primary: TtsProvider, cfg?: OpenClawConfig): TtsProvider[];
declare function isTtsProviderConfigured(
  config: ResolvedTtsConfig,
  provider: TtsProvider,
  cfg?: OpenClawConfig,
): boolean;
declare function formatTtsProviderError(provider: TtsProvider, err: unknown): string;
declare function sanitizeTtsErrorForLog(err: unknown): string;
declare function textToSpeech(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsResult>;
declare function synthesizeSpeech(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsSynthesisResult>;
declare function streamSpeech(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsSynthesisStreamResult>;
declare function textToSpeechStream(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsStreamResult>;
declare function textToSpeechTelephony(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  overrides?: TtsDirectiveOverrides;
  timeoutMs?: number;
}): Promise<TtsTelephonyResult>;
declare function listSpeechVoices(params: {
  provider: string;
  cfg?: OpenClawConfig;
  config?: ResolvedTtsConfig;
  apiKey?: string;
  baseUrl?: string;
}): Promise<SpeechVoiceOption[]>;
declare function maybeApplyTtsToPayload(params: {
  payload: ReplyPayload;
  cfg: OpenClawConfig;
  channel?: string;
  kind?: "tool" | "block" | "final";
  inboundAudio?: boolean;
  ttsAuto?: string;
  agentId?: string;
  accountId?: string;
}): Promise<ReplyPayload>;
declare const testApi: {
  parseTtsDirectives: typeof parseTtsDirectives;
  resolveModelOverridePolicy: typeof resolveModelOverridePolicy;
  supportsNativeVoiceNoteTts: typeof supportsNativeVoiceNoteTts;
  supportsTranscodedVoiceNoteTts: typeof supportsTranscodedVoiceNoteTts;
  resolveTtsSynthesisTarget: typeof resolveTtsSynthesisTarget;
  shouldDeliverTtsAsVoice: typeof shouldDeliverTtsAsVoice;
  summarizeText: typeof summarizeText;
  getResolvedSpeechProviderConfig: typeof getResolvedSpeechProviderConfig;
  formatTtsProviderError: typeof formatTtsProviderError;
  sanitizeTtsErrorForLog: typeof sanitizeTtsErrorForLog;
};
//#endregion
//#region src/plugin-sdk/tts-runtime.d.ts
/** Compatibility no-op retained for callers that prewarm facade runtimes generically. */
declare function prewarmTtsRuntimeFacade(): void;
//#endregion
export {
  setTtsProvider as A,
  resolveTtsProviderOrder as C,
  setTtsEnabled as D,
  setTtsAutoMode as E,
  textToSpeechStream as F,
  textToSpeechTelephony as I,
  synthesizeSpeech as M,
  testApi as N,
  setTtsMaxLength as O,
  textToSpeech as P,
  resolveTtsPrefsPath as S,
  setSummarizationEnabled as T,
  listTtsPersonas as _,
  TtsSynthesisStreamResult as a,
  resolveTtsAutoMode as b,
  getLastTtsAttempt as c,
  getTtsPersona as d,
  getTtsProvider as f,
  listSpeechVoices as g,
  isTtsProviderConfigured as h,
  TtsSynthesisResult as i,
  streamSpeech as j,
  setTtsPersona as k,
  getResolvedSpeechProviderConfig as l,
  isTtsEnabled as m,
  TtsResult as n,
  TtsTelephonyResult as o,
  isSummarizationEnabled as p,
  TtsStreamResult as r,
  buildTtsSystemPromptHint as s,
  prewarmTtsRuntimeFacade as t,
  getTtsMaxLength as u,
  maybeApplyTtsToPayload as v,
  setLastTtsAttempt as w,
  resolveTtsConfig as x,
  resolveExplicitTtsOverrides as y,
};
