import {
  _ as XaiRealtimeVoiceBridgeConfig,
  g as XaiRealtimeSessionUpdate,
  h as XaiRealtimeEvent,
} from "./realtime-voice-config-B5xHzUr6.js";
import {
  Ra as RealtimeVoiceToolResultOptions,
  Sa as RealtimeVoiceBargeInOptions,
  xa as RealtimeVoiceAudioFormat,
} from "./types-Ga3mNO_F.js";

//#region extensions/xai/realtime-voice-protocol.d.ts
declare abstract class XaiRealtimeVoiceProtocol {
  protected readonly config: XaiRealtimeVoiceBridgeConfig;
  protected readonly audioFormat: RealtimeVoiceAudioFormat;
  protected markQueue: string[];
  protected responseStartTimestamp: number | null;
  protected responseActive: boolean;
  protected responseCreateInFlight: boolean;
  protected responseCancelInFlight: boolean;
  protected responseCreatePending: boolean;
  protected continuingToolCallIds: Set<string>;
  protected pendingToolCallIds: Set<string>;
  protected latestMediaTimestamp: number;
  protected lastAssistantItemId: string | null;
  protected toolCallBuffers: Map<
    string,
    {
      name: string;
      callId: string;
      args: string;
    }
  >;
  protected deliveredToolCallKeys: Set<string>;
  protected pendingToolResultAcks: Map<
    string,
    {
      result: unknown;
      options?: RealtimeVoiceToolResultOptions;
    }
  >;
  protected conversationId: string | null;
  constructor(config: XaiRealtimeVoiceBridgeConfig);
  protected abstract sendEvent(event: unknown, detail?: string): void;
  protected sendUserMessageNow(text: string): void;
  protected submitToolResultNow(
    callId: string,
    result: unknown,
    options?: RealtimeVoiceToolResultOptions,
  ): void;
  acknowledgeMark(markName?: string): void;
  handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
  protected handleServerVadBargeIn(): void;
  protected buildSessionUpdate(): XaiRealtimeSessionUpdate;
  private resolveRealtimeAudioFormat;
  protected emitToolCallOnce(fields: {
    itemId?: string;
    callId?: string;
    name?: string;
    rawArgs?: string;
  }): void;
  private flushPendingResponseCreateAfterToolResults;
  protected requestResponseCreate(): void;
  protected flushPendingResponseCreate(): void;
  protected resetRealtimeSessionState(options?: { preserveToolCallState?: boolean }): void;
  protected sendMark(): void;
  protected abstract resetInputTranscripts(): void;
  protected abstract handleEvent(event: XaiRealtimeEvent): void;
}
//#endregion
export { XaiRealtimeVoiceProtocol as t };
