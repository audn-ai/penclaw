import { t as XaiRealtimeVoiceBridge } from "./realtime-voice-bridge-CO-vcBnh.js";
import "./realtime-voice-DQqBL-aH.js";
import {
  g as normalizeXaiRealtimeProviderConfig,
  h as normalizeXaiRealtimeBaseUrl,
  i as XAI_REALTIME_DEFAULT_MODEL,
  m as hasXaiRealtimeApiKeyInput,
  v as resolveXaiRealtimeApiKey,
} from "./realtime-voice-config-gV0iEKp_.js";
import {
  Q as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
  Z as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
} from "./session-log-runtime-DVXN-XFR.js";
//#region extensions/xai/realtime-voice-provider.ts
function buildXaiRealtimeVoiceProvider() {
  return {
    id: "xai",
    label: "xAI Grok Voice",
    aliases: ["xai-realtime-voice", "grok-voice"],
    defaultModel: XAI_REALTIME_DEFAULT_MODEL,
    autoSelectOrder: 25,
    capabilities: {
      transports: ["gateway-relay"],
      inputAudioFormats: [
        REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
        REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
      ],
      outputAudioFormats: [
        REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
        REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
      ],
      supportsBargeIn: true,
      handlesInputAudioBargeIn: true,
      supportsToolCalls: true,
      supportsSessionResumption: true,
    },
    resolveConfig: ({ rawConfig }) => normalizeXaiRealtimeProviderConfig(rawConfig),
    isConfigured: ({ providerConfig, cfg }) =>
      hasXaiRealtimeApiKeyInput(normalizeXaiRealtimeProviderConfig(providerConfig).apiKey, cfg),
    createBridge: (req) => {
      const config = normalizeXaiRealtimeProviderConfig(req.providerConfig);
      if (req.autoRespondToAudio === false)
        throw new Error(
          'xAI realtime voice requires automatic server-VAD responses; use consultRouting: "provider-direct"',
        );
      if ((req.interruptResponseOnInputAudio ?? config.interruptResponseOnInputAudio) === false)
        throw new Error("xAI realtime voice requires automatic server-VAD interruption handling");
      return new XaiRealtimeVoiceBridge({
        ...req,
        apiKey: config.apiKey,
        baseUrl: normalizeXaiRealtimeBaseUrl(config.baseUrl),
        model: config.model,
        voice: config.voice,
        vadThreshold: config.vadThreshold,
        silenceDurationMs: config.silenceDurationMs,
        prefixPaddingMs: config.prefixPaddingMs,
        reasoningEffort: config.reasoningEffort,
        sessionResumption: config.sessionResumption,
        resolveApiKey: () => resolveXaiRealtimeApiKey(config.apiKey, req.cfg),
      });
    },
  };
}
//#endregion
export { buildXaiRealtimeVoiceProvider as t };
