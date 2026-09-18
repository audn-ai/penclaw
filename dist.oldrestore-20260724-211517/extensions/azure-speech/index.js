import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { t as buildAzureSpeechProvider } from "../../speech-provider-De7OIPhe.js";
//#region extensions/azure-speech/index.ts
/**
 * Azure Speech plugin entry. It registers the Azure text-to-speech provider for
 * message voice output and voice-note generation.
 */
/** Plugin entry for Azure Speech TTS. */
var azure_speech_default = definePluginEntry({
  id: "azure-speech",
  name: "Azure Speech",
  description: "Bundled Azure Speech provider",
  register(api) {
    api.registerSpeechProvider(buildAzureSpeechProvider());
  },
});
//#endregion
export { azure_speech_default as default };
