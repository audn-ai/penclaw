import { h as XaiRealtimeEvent } from "./realtime-voice-config-B5xHzUr6.js";
import { t as XaiRealtimeVoiceProtocol } from "./realtime-voice-protocol-Bj_E0kRp.js";

//#region extensions/xai/realtime-voice-events.d.ts
declare abstract class XaiRealtimeVoiceEvents extends XaiRealtimeVoiceProtocol {
  private assistantTranscriptBuffer;
  private assistantTranscriptFinalized;
  private inputTranscriptReplacements;
  protected abstract onSessionUpdated(): void;
  protected handleEvent(event: XaiRealtimeEvent): void;
  protected resetInputTranscripts(): void;
  private appendAssistantTranscriptDelta;
  private flushAssistantTranscript;
  private resetAssistantTranscript;
  private inputTranscriptKey;
  private handleErrorEvent;
  private describeServerEvent;
}
//#endregion
export { XaiRealtimeVoiceEvents as t };
