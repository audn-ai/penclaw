import { t as deepgramMediaUnderstandingProvider } from "../../media-understanding-provider-C-GBDa8H.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { t as buildDeepgramRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-b3MS-jG3.js";
//#region extensions/deepgram/index.ts
var deepgram_default = definePluginEntry({
  id: "deepgram",
  name: "Deepgram Media Understanding",
  description: "Bundled Deepgram audio transcription provider",
  register(api) {
    api.registerMediaUnderstandingProvider(deepgramMediaUnderstandingProvider);
    api.registerRealtimeTranscriptionProvider(buildDeepgramRealtimeTranscriptionProvider());
  },
});
//#endregion
export { deepgram_default as default };
