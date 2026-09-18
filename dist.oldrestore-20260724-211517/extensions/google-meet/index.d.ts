import { h as callGatewayFromCli } from "../../gateway-runtime-nDXRrK0O.js";
import {
  v as OpenClawPluginConfigSchema,
  y as OpenClawPluginDefinition$1,
} from "../../plugin-entry-DPCR66aO.js";
import { at as RealtimeVoiceAgentConsultToolPolicy } from "../../realtime-voice-D0WkjydD.js";
import { A as OpenClawPluginDefinition } from "../../types-Ga3mNO_F.js";

//#region extensions/google-meet/src/config.d.ts
type GoogleMeetTransport = "chrome" | "chrome-node" | "twilio";
type GoogleMeetMode = "agent" | "bidi" | "transcribe";
type GoogleMeetRealtimeStrategy = "agent" | "bidi";
type GoogleMeetChromeAudioFormat = "pcm16-24khz" | "g711-ulaw-8khz";
type GoogleMeetToolPolicy = RealtimeVoiceAgentConsultToolPolicy;
type GoogleMeetConfig = {
  enabled: boolean;
  defaults: {
    meeting?: string;
  };
  preview: {
    enrollmentAcknowledged: boolean;
  };
  defaultTransport: GoogleMeetTransport;
  defaultMode: GoogleMeetMode;
  chrome: {
    audioBackend: "blackhole-2ch";
    audioFormat: GoogleMeetChromeAudioFormat;
    audioBufferBytes: number;
    launch: boolean;
    browserProfile?: string;
    guestName: string;
    reuseExistingTab: boolean;
    autoJoin: boolean;
    joinTimeoutMs: number;
    waitForInCallMs: number;
    audioInputCommand?: string[];
    audioOutputCommand?: string[];
    bargeInInputCommand?: string[];
    bargeInRmsThreshold: number;
    bargeInPeakThreshold: number;
    bargeInCooldownMs: number;
    audioBridgeCommand?: string[];
    audioBridgeHealthCommand?: string[];
  };
  chromeNode: {
    node?: string;
  };
  twilio: {
    defaultDialInNumber?: string;
    defaultPin?: string;
    defaultDtmfSequence?: string;
  };
  voiceCall: {
    enabled: boolean;
    gatewayUrl?: string;
    token?: string;
    requestTimeoutMs: number;
    dtmfDelayMs: number;
    postDtmfSpeechDelayMs: number;
    introMessage?: string;
  };
  realtime: {
    strategy: GoogleMeetRealtimeStrategy;
    provider?: string;
    transcriptionProvider?: string;
    voiceProvider?: string;
    model?: string;
    instructions?: string;
    introMessage?: string;
    agentId?: string;
    toolPolicy: GoogleMeetToolPolicy;
    providers: Record<string, Record<string, unknown>>;
  };
  oauth: {
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    accessToken?: string;
    expiresAt?: number;
  };
  auth: {
    provider: "google-oauth";
    clientId?: string;
    clientSecret?: string;
    tokenPath?: string;
  };
};
declare function resolveGoogleMeetGatewayOperationTimeoutMs(config: GoogleMeetConfig): number;
//#endregion
//#region extensions/google-meet/index.d.ts
declare const testing: {
  setCallGatewayFromCliForTests(next?: typeof callGatewayFromCli): void;
  setPlatformForTests(next?: () => NodeJS.Platform): void;
  isGoogleMeetAgentToolActionUnsupportedOnHost: typeof isGoogleMeetAgentToolActionUnsupportedOnHost;
  resolveGoogleMeetGatewayOperationTimeoutMs: typeof resolveGoogleMeetGatewayOperationTimeoutMs;
};
declare function isGoogleMeetAgentToolActionUnsupportedOnHost(params: {
  config: GoogleMeetConfig;
  raw: Record<string, unknown>;
  platform?: NodeJS.Platform;
}): boolean;
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<
  OpenClawPluginDefinition,
  "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors"
>;
//#endregion
export { testing as __testing, testing, _default as default };
