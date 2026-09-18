import {
  Ta as RealtimeVoiceBridgeCreateRequest,
  ja as RealtimeVoiceProviderConfig,
} from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/xai/realtime-voice-config.d.ts
type XaiRealtimeReasoningEffort = "high" | "none";
type XaiRealtimeVoiceProviderConfig = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  voice?: string;
  vadThreshold?: number;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  interruptResponseOnInputAudio?: boolean;
  reasoningEffort?: XaiRealtimeReasoningEffort;
  sessionResumption?: boolean;
};
type XaiRealtimeVoiceBridgeConfig = RealtimeVoiceBridgeCreateRequest & {
  apiKey?: string;
  baseUrl: string;
  model?: string;
  voice?: string;
  vadThreshold?: number;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  reasoningEffort?: XaiRealtimeReasoningEffort;
  sessionResumption?: boolean;
  resolveApiKey?: () => Promise<string>;
};
type XaiRealtimeEvent = {
  type: string;
  delta?: string;
  data?: string;
  text?: string;
  transcript?: string;
  item_id?: string;
  response_id?: string;
  call_id?: string;
  name?: string;
  arguments?: string;
  response?: {
    id?: string;
    status?: string;
    status_details?: unknown;
  };
  conversation?: {
    id?: string;
  };
  item?: {
    id?: string;
    type?: string;
    call_id?: string;
    name?: string;
    arguments?: string;
  };
  error?: unknown;
};
type XaiRealtimeAudioFormatConfig =
  | {
      type: "audio/pcm";
      rate: 24000;
    }
  | {
      type: "audio/pcmu";
    };
type XaiRealtimeSessionUpdate = {
  type: "session.update";
  session: {
    instructions?: string;
    voice?: string;
    output_modalities?: string[];
    turn_detection?: {
      type: "server_vad";
      threshold?: number;
      prefix_padding_ms?: number;
      silence_duration_ms?: number;
    };
    audio: {
      input: {
        format: XaiRealtimeAudioFormatConfig;
        transcription: {
          model: string;
        };
      };
      output: {
        format: XaiRealtimeAudioFormatConfig;
      };
    };
    reasoning?: {
      effort: XaiRealtimeReasoningEffort;
    };
    resumption?: {
      enabled: boolean;
    };
    tools?: RealtimeVoiceBridgeCreateRequest["tools"];
    tool_choice?: string;
  };
};
declare const XAI_REALTIME_DEFAULT_MODEL = "grok-voice-latest";
declare const XAI_REALTIME_CONNECT_TIMEOUT_MS = 10000;
declare const XAI_REALTIME_WS_MAX_PAYLOAD_BYTES: number;
declare const XAI_REALTIME_MAX_RECONNECT_ATTEMPTS = 5;
declare const XAI_REALTIME_BASE_RECONNECT_DELAY_MS = 1000;
declare const XAI_REALTIME_MAX_PENDING_TOOL_RESULTS = 128;
declare const XAI_REALTIME_MAX_PENDING_USER_MESSAGES = 128;
declare const XAI_REALTIME_DEFAULT_VAD_THRESHOLD = 0.85;
declare const XAI_REALTIME_DEFAULT_PREFIX_PADDING_MS = 333;
declare const XAI_REALTIME_DEFAULT_SILENCE_DURATION_MS = 500;
declare const XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL = "grok-transcribe";
declare const XAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX =
  "Conversation already has an active response in progress:";
declare const XAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR =
  "Cancellation failed: no active response found";
declare function normalizeXaiRealtimeBaseUrl(value?: string): string;
declare function normalizeXaiRealtimeProviderConfig(
  config: RealtimeVoiceProviderConfig,
): XaiRealtimeVoiceProviderConfig;
declare function readXaiRealtimeErrorDetail(error: unknown): string;
declare function toXaiRealtimeWsUrl(
  baseUrl: string,
  model: string,
  conversationId?: string,
): string;
declare function resolveXaiRealtimeApiKey(
  configApiKey: string | undefined,
  cfg: OpenClawConfig | undefined,
): Promise<string>;
declare function hasXaiRealtimeApiKeyInput(
  configApiKey: string | undefined,
  cfg: OpenClawConfig | undefined,
): boolean;
//#endregion
export {
  resolveXaiRealtimeApiKey as C,
  readXaiRealtimeErrorDetail as S,
  XaiRealtimeVoiceBridgeConfig as _,
  XAI_REALTIME_DEFAULT_PREFIX_PADDING_MS as a,
  normalizeXaiRealtimeBaseUrl as b,
  XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL as c,
  XAI_REALTIME_MAX_RECONNECT_ATTEMPTS as d,
  XAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR as f,
  XaiRealtimeSessionUpdate as g,
  XaiRealtimeEvent as h,
  XAI_REALTIME_DEFAULT_MODEL as i,
  XAI_REALTIME_MAX_PENDING_TOOL_RESULTS as l,
  XaiRealtimeAudioFormatConfig as m,
  XAI_REALTIME_BASE_RECONNECT_DELAY_MS as n,
  XAI_REALTIME_DEFAULT_SILENCE_DURATION_MS as o,
  XAI_REALTIME_WS_MAX_PAYLOAD_BYTES as p,
  XAI_REALTIME_CONNECT_TIMEOUT_MS as r,
  XAI_REALTIME_DEFAULT_VAD_THRESHOLD as s,
  XAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX as t,
  XAI_REALTIME_MAX_PENDING_USER_MESSAGES as u,
  XaiRealtimeVoiceProviderConfig as v,
  toXaiRealtimeWsUrl as w,
  normalizeXaiRealtimeProviderConfig as x,
  hasXaiRealtimeApiKeyInput as y,
};
