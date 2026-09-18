import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-BSUpznSC.js";
import { t as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-ClDWC-RA.js";
import { t as openAiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-BPerb5Km.js";
import { i as buildOpenAIProvider } from "../../openai-provider-DQaQ3pkr.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-ef53THzv.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import {
  a as resolveOpenAISystemPromptContribution,
  i as resolveOpenAIPromptOverlayMode,
} from "../../prompt-overlay-B-AsaOzr.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-CLA-JkCS.js";
import { t as buildOpenAIRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-DtrWW1AF.js";
import { t as buildOpenAIRealtimeVoiceProvider } from "../../realtime-voice-provider-B4OpBKCS.js";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-DG7ABIRK.js";
import { t as buildOpenAIVideoGenerationProvider } from "../../video-generation-provider-DrREkj4v.js";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
  id: "openai",
  name: "OpenAI Provider",
  description: "Bundled OpenAI provider plugins",
  register(api) {
    const openAIToolCompatHooks = buildProviderToolCompatFamilyHooks("openai");
    const buildProviderWithPromptContribution = (provider) => ({
      ...provider,
      ...openAIToolCompatHooks,
      resolveSystemPromptContribution: (ctx) => {
        const pluginConfig =
          resolvePluginConfigObject(ctx.config, "openai") ??
          (ctx.config ? void 0 : api.pluginConfig);
        return resolveOpenAISystemPromptContribution({
          config: ctx.config,
          legacyPluginConfig: pluginConfig,
          mode: resolveOpenAIPromptOverlayMode(pluginConfig),
          modelProviderId: provider.id,
          modelId: ctx.modelId,
          trigger: ctx.trigger,
        });
      },
    });
    api.registerProvider(buildProviderWithPromptContribution(buildOpenAIProvider()));
    api.registerMemoryEmbeddingProvider(openAiMemoryEmbeddingProviderAdapter);
    api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
    api.registerRealtimeTranscriptionProvider(buildOpenAIRealtimeTranscriptionProvider());
    api.registerRealtimeVoiceProvider(buildOpenAIRealtimeVoiceProvider());
    api.registerSpeechProvider(buildOpenAISpeechProvider());
    api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
    api.registerVideoGenerationProvider(buildOpenAIVideoGenerationProvider());
  },
});
//#endregion
export { openai_default as default };
