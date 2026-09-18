import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { t as googleApiError } from "./google-api-errors-9Rd9WdCI.js";
import {
  A as resolvePositiveTimerTimeoutMs,
  a as addTimerTimeoutGraceMs,
} from "./number-coercion-CJQ8TR--.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DLMRBkZU.js";
import { a as asRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  P as resolveRealtimeVoiceAgentConsultToolPolicy,
  T as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
} from "./session-log-runtime-DVXN-XFR.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-http-BDIltggC.js";
import {
  c as normalizeOptionalString$1,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./realtime-voice-DQqBL-aH.js";
import { a as normalizeOptionalTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region extensions/google-meet/src/meet-url.ts
function normalizeOptionalString(value) {
  if (typeof value !== "string") return;
  return value.trim() || void 0;
}
function normalizeMeetUrl(input) {
  const raw = normalizeOptionalString(input);
  if (!raw) throw new Error("url required");
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("url must be a valid Google Meet URL");
  }
  if (
    url.protocol !== "https:" ||
    url.hostname.toLowerCase() !== "meet.google.com" ||
    url.port ||
    url.username ||
    url.password
  )
    throw new Error("url must be an explicit https://meet.google.com/... URL");
  if (!/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}(?:$|[/?#])/i.test(url.pathname))
    throw new Error("url must include a Google Meet meeting code");
  return url.toString();
}
//#endregion
//#region extensions/google-meet/src/calendar.ts
const GOOGLE_CALENDAR_API_BASE_URL = "https://www.googleapis.com/calendar/v3";
const GOOGLE_CALENDAR_API_HOST = "www.googleapis.com";
const GOOGLE_CALENDAR_EVENTS_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
const GOOGLE_CALENDAR_REQUEST_TIMEOUT_MS = 3e4;
function appendQuery(url, query) {
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(query))
    if (value !== void 0) parsed.searchParams.set(key, String(value));
  return parsed.toString();
}
function normalizeGoogleMeetCalendarUri(value) {
  if (!value?.trim()) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    if (
      url.hostname.toLowerCase() !== "meet.google.com" ||
      url.port ||
      url.username ||
      url.password
    )
      return;
    url.protocol = "https:";
    return normalizeMeetUrl(url.toString());
  } catch {
    return;
  }
}
function extractGoogleMeetUriFromText(value) {
  const matches = value?.matchAll(/https:\/\/meet\.google\.com\/[a-z0-9-]+/gi);
  for (const match of matches ?? []) {
    const uri = normalizeGoogleMeetCalendarUri(match[0]);
    if (uri) return uri;
  }
}
function findFirstGoogleMeetCalendarUri(entryPoints, predicate = () => true) {
  for (const entry of entryPoints) {
    if (!predicate(entry)) continue;
    const uri = normalizeGoogleMeetCalendarUri(entry.uri);
    if (uri) return uri;
  }
}
function extractGoogleMeetUriFromCalendarEvent(event) {
  const hangoutLink = normalizeGoogleMeetCalendarUri(event.hangoutLink);
  if (hangoutLink) return hangoutLink;
  const entryPoints = event.conferenceData?.entryPoints ?? [];
  const videoEntryUri = findFirstGoogleMeetCalendarUri(
    entryPoints,
    (entry) => entry.entryPointType === "video",
  );
  if (videoEntryUri) return videoEntryUri;
  const meetEntryUri = findFirstGoogleMeetCalendarUri(entryPoints);
  if (meetEntryUri) return meetEntryUri;
  return (
    extractGoogleMeetUriFromText(event.location) ?? extractGoogleMeetUriFromText(event.description)
  );
}
function buildGoogleMeetCalendarDayWindow(now = /* @__PURE__ */ new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return {
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
  };
}
function parseCalendarEventTime(value) {
  const raw = value?.dateTime ?? value?.date;
  if (!raw) return;
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function rankCalendarEvent(event, nowMs) {
  const startMs = parseCalendarEventTime(event.start) ?? Number.POSITIVE_INFINITY;
  const endMs = parseCalendarEventTime(event.end) ?? startMs;
  if (startMs <= nowMs && endMs >= nowMs) return 0;
  if (startMs > nowMs) return startMs - nowMs;
  return nowMs - startMs + 720 * 60 * 60 * 1e3;
}
function chooseBestMeetCalendarEvent(events, now) {
  const nowMs = now.getTime();
  let selected;
  let selectedRank = Number.POSITIVE_INFINITY;
  for (const event of events) {
    if (event.status === "cancelled" || !extractGoogleMeetUriFromCalendarEvent(event)) continue;
    const rank = rankCalendarEvent(event, nowMs);
    if (!selected || rank < selectedRank) {
      selected = event;
      selectedRank = rank;
    }
  }
  return selected;
}
async function fetchGoogleCalendarEvents(params) {
  const calendarId = params.calendarId?.trim() || "primary";
  const now = params.now ?? /* @__PURE__ */ new Date();
  const defaultTimeMax = new Date(now);
  defaultTimeMax.setDate(defaultTimeMax.getDate() + 7);
  const { response, release } = await fetchWithSsrFGuard({
    url: appendQuery(
      `${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        maxResults: params.maxResults ?? 50,
        orderBy: "startTime",
        q: params.eventQuery?.trim() || void 0,
        showDeleted: false,
        singleEvents: true,
        timeMin: params.timeMin ?? now.toISOString(),
        timeMax: params.timeMax ?? defaultTimeMax.toISOString(),
      },
    ),
    init: {
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: "application/json",
      },
    },
    policy: { allowedHostnames: [GOOGLE_CALENDAR_API_HOST] },
    auditContext: "google-meet.calendar.events.list",
    timeoutMs: GOOGLE_CALENDAR_REQUEST_TIMEOUT_MS,
  });
  try {
    if (!response.ok)
      throw await googleApiError({
        response,
        prefix: "Google Calendar events.list",
        scopes: [GOOGLE_CALENDAR_EVENTS_SCOPE],
      });
    const payload = await readProviderJsonResponse(response, "Google Calendar events.list");
    if (payload.items !== void 0 && !Array.isArray(payload.items))
      throw new Error("Google Calendar events.list response had non-array items");
    return {
      calendarId,
      events: payload.items ?? [],
      now,
    };
  } finally {
    await release();
  }
}
async function listGoogleMeetCalendarEvents(params) {
  const { calendarId, events, now } = await fetchGoogleCalendarEvents(params);
  const best = chooseBestMeetCalendarEvent(events, now);
  return {
    calendarId,
    events: events
      .map((event) => {
        const meetingUri = extractGoogleMeetUriFromCalendarEvent(event);
        return meetingUri
          ? {
              event,
              meetingUri,
              selected: event === best,
            }
          : void 0;
      })
      .filter((event) => Boolean(event)),
  };
}
async function findGoogleMeetCalendarEvent(params) {
  const result = await listGoogleMeetCalendarEvents(params);
  const selected = result.events.find((event) => event.selected) ?? result.events[0];
  if (!selected)
    throw new Error("No Google Calendar event with a Google Meet link matched the query");
  return {
    calendarId: result.calendarId,
    event: selected.event,
    meetingUri: selected.meetingUri,
  };
}
//#endregion
//#region extensions/google-meet/src/config.ts
function resolveGoogleMeetGatewayOperationTimeoutMs(config) {
  return Math.max(
    6e4,
    addTimerTimeoutGraceMs(config.chrome.joinTimeoutMs, 3e4) ?? 1,
    addTimerTimeoutGraceMs(config.voiceCall.requestTimeoutMs, 1e4) ?? 1,
  );
}
const SOX_DEFAULT_BUFFER_BYTES = 8192;
const SOX_MIN_BUFFER_BYTES = 17;
const DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES = SOX_DEFAULT_BUFFER_BYTES / 2;
const PLAIN_DECIMAL_NUMBER_RE = /^\d+(?:\.\d+)?$/;
function withSoxBuffer(command, bufferBytes) {
  return [command[0] ?? "sox", "-q", "--buffer", String(bufferBytes), ...command.slice(2)];
}
const DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND_BASE = [
  "sox",
  "-q",
  "-t",
  "coreaudio",
  "BlackHole 2ch",
  "-t",
  "raw",
  "-r",
  "24000",
  "-c",
  "1",
  "-e",
  "signed-integer",
  "-b",
  "16",
  "-L",
  "-",
];
const DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND_BASE = [
  "sox",
  "-q",
  "-t",
  "raw",
  "-r",
  "24000",
  "-c",
  "1",
  "-e",
  "signed-integer",
  "-b",
  "16",
  "-L",
  "-",
  "-t",
  "coreaudio",
  "BlackHole 2ch",
];
const LEGACY_GOOGLE_MEET_AUDIO_INPUT_COMMAND_BASE = [
  "rec",
  "-q",
  "-t",
  "raw",
  "-r",
  "8000",
  "-c",
  "1",
  "-e",
  "mu-law",
  "-b",
  "8",
  "-",
];
const LEGACY_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND_BASE = [
  "play",
  "-q",
  "-t",
  "raw",
  "-r",
  "8000",
  "-c",
  "1",
  "-e",
  "mu-law",
  "-b",
  "8",
  "-",
];
const DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND = withSoxBuffer(
  DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND_BASE,
  DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES,
);
const DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND = withSoxBuffer(
  DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND_BASE,
  DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES,
);
const DEFAULT_GOOGLE_MEET_CHROME_AUDIO_FORMAT = "pcm16-24khz";
const DEFAULT_GOOGLE_MEET_BARGE_IN_RMS_THRESHOLD = 650;
const DEFAULT_GOOGLE_MEET_BARGE_IN_PEAK_THRESHOLD = 2500;
const DEFAULT_GOOGLE_MEET_BARGE_IN_COOLDOWN_MS = 900;
const DEFAULT_GOOGLE_MEET_REALTIME_INSTRUCTIONS = `You are joining a private Google Meet as an OpenClaw voice transport. Keep spoken replies brief and natural. In agent mode, wait for OpenClaw consult results and speak them exactly. In bidi mode, answer directly and call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} for deeper reasoning, current information, or tools.`;
const DEFAULT_GOOGLE_MEET_REALTIME_INTRO_MESSAGE = "Say exactly: I'm here and listening.";
const DEFAULT_GOOGLE_MEET_CONFIG = {
  enabled: true,
  defaults: {},
  preview: { enrollmentAcknowledged: false },
  defaultTransport: "chrome",
  defaultMode: "agent",
  chrome: {
    audioBackend: "blackhole-2ch",
    audioFormat: DEFAULT_GOOGLE_MEET_CHROME_AUDIO_FORMAT,
    audioBufferBytes: DEFAULT_GOOGLE_MEET_AUDIO_BUFFER_BYTES,
    launch: true,
    guestName: "OpenClaw Agent",
    reuseExistingTab: true,
    autoJoin: true,
    joinTimeoutMs: 3e4,
    waitForInCallMs: 2e4,
    audioInputCommand: [...DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND],
    audioOutputCommand: [...DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND],
    bargeInRmsThreshold: DEFAULT_GOOGLE_MEET_BARGE_IN_RMS_THRESHOLD,
    bargeInPeakThreshold: DEFAULT_GOOGLE_MEET_BARGE_IN_PEAK_THRESHOLD,
    bargeInCooldownMs: DEFAULT_GOOGLE_MEET_BARGE_IN_COOLDOWN_MS,
  },
  chromeNode: {},
  twilio: {},
  voiceCall: {
    enabled: true,
    requestTimeoutMs: 3e4,
    dtmfDelayMs: 12e3,
    postDtmfSpeechDelayMs: 5e3,
  },
  realtime: {
    strategy: "agent",
    provider: "openai",
    transcriptionProvider: "openai",
    instructions: DEFAULT_GOOGLE_MEET_REALTIME_INSTRUCTIONS,
    introMessage: DEFAULT_GOOGLE_MEET_REALTIME_INTRO_MESSAGE,
    toolPolicy: "safe-read-only",
    providers: {},
  },
  oauth: {},
  auth: { provider: "google-oauth" },
};
const GOOGLE_MEET_CLIENT_ID_KEYS = ["OPENCLAW_GOOGLE_MEET_CLIENT_ID", "GOOGLE_MEET_CLIENT_ID"];
const GOOGLE_MEET_CLIENT_SECRET_KEYS = [
  "OPENCLAW_GOOGLE_MEET_CLIENT_SECRET",
  "GOOGLE_MEET_CLIENT_SECRET",
];
const GOOGLE_MEET_REFRESH_TOKEN_KEYS = [
  "OPENCLAW_GOOGLE_MEET_REFRESH_TOKEN",
  "GOOGLE_MEET_REFRESH_TOKEN",
];
const GOOGLE_MEET_ACCESS_TOKEN_KEYS = [
  "OPENCLAW_GOOGLE_MEET_ACCESS_TOKEN",
  "GOOGLE_MEET_ACCESS_TOKEN",
];
const GOOGLE_MEET_ACCESS_TOKEN_EXPIRES_AT_KEYS = [
  "OPENCLAW_GOOGLE_MEET_ACCESS_TOKEN_EXPIRES_AT",
  "GOOGLE_MEET_ACCESS_TOKEN_EXPIRES_AT",
];
const GOOGLE_MEET_DEFAULT_MEETING_KEYS = [
  "OPENCLAW_GOOGLE_MEET_DEFAULT_MEETING",
  "GOOGLE_MEET_DEFAULT_MEETING",
];
const GOOGLE_MEET_PREVIEW_ACK_KEYS = [
  "OPENCLAW_GOOGLE_MEET_PREVIEW_ACK",
  "GOOGLE_MEET_PREVIEW_ACK",
];
function resolveBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function resolveNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}
function resolveTimerConfigMs(value, fallback) {
  return resolvePositiveTimerTimeoutMs(resolveNumber(value, fallback), fallback);
}
function resolveOptionalNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    const parsed = PLAIN_DECIMAL_NUMBER_RE.test(trimmed) ? Number(trimmed) : NaN;
    return Number.isFinite(parsed) ? parsed : void 0;
  }
}
function readEnvString(env, keys) {
  for (const key of keys) {
    const value = normalizeOptionalString$1(env[key]);
    if (value) return value;
  }
}
function normalizeStringAllowEmpty(value) {
  return typeof value === "string" ? value.trim() : void 0;
}
function readEnvBoolean(env, keys) {
  const normalized = normalizeOptionalLowercaseString(readEnvString(env, keys));
  if (!normalized) return;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
}
function readEnvNumber(env, keys) {
  return resolveOptionalNumber(readEnvString(env, keys));
}
function resolveStringArray(value) {
  return normalizeOptionalTrimmedStringList(value);
}
function resolveProvidersConfig(value) {
  const raw = asRecord(value);
  const providers = {};
  for (const [key, entry] of Object.entries(raw)) {
    const providerId = normalizeOptionalLowercaseString(key);
    if (!providerId) continue;
    providers[providerId] = asRecord(entry);
  }
  return providers;
}
function resolveTransport(value, fallback) {
  const normalized = normalizeOptionalLowercaseString(value);
  return normalized === "chrome" || normalized === "chrome-node" || normalized === "twilio"
    ? normalized
    : fallback;
}
function resolveMode(value, fallback) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (normalized === "realtime") return "agent";
  return normalized === "agent" || normalized === "bidi" || normalized === "transcribe"
    ? normalized
    : fallback;
}
function resolveRealtimeStrategy(value, fallback) {
  const normalized = normalizeOptionalLowercaseString(value);
  return normalized === "agent" || normalized === "bidi" ? normalized : fallback;
}
function resolveChromeAudioFormat(value) {
  switch (normalizeOptionalString$1(value)?.toLowerCase().replaceAll("_", "-")) {
    case "pcm16-24khz":
    case "pcm16-24k":
    case "pcm24":
    case "pcm":
      return "pcm16-24khz";
    case "g711-ulaw-8khz":
    case "g711-ulaw-8k":
    case "g711-ulaw":
    case "mulaw":
    case "mu-law":
      return "g711-ulaw-8khz";
    default:
      return;
  }
}
function resolveAudioBufferBytes(value, fallback) {
  const number = resolveNumber(value, fallback);
  if (!Number.isFinite(number) || number <= 0) return fallback;
  return Math.max(SOX_MIN_BUFFER_BYTES, Math.trunc(number));
}
function defaultAudioInputCommand(format, bufferBytes) {
  return withSoxBuffer(
    format === "g711-ulaw-8khz"
      ? LEGACY_GOOGLE_MEET_AUDIO_INPUT_COMMAND_BASE
      : DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND_BASE,
    bufferBytes,
  );
}
function defaultAudioOutputCommand(format, bufferBytes) {
  return withSoxBuffer(
    format === "g711-ulaw-8khz"
      ? LEGACY_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND_BASE
      : DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND_BASE,
    bufferBytes,
  );
}
function resolveGoogleMeetConfig(input) {
  return resolveGoogleMeetConfigWithEnv(input);
}
function resolveGoogleMeetConfigWithEnv(input, env = process.env) {
  const raw = asRecord(input);
  const defaults = asRecord(raw.defaults);
  const preview = asRecord(raw.preview);
  const chrome = asRecord(raw.chrome);
  const configuredAudioInputCommand = resolveStringArray(chrome.audioInputCommand);
  const configuredAudioOutputCommand = resolveStringArray(chrome.audioOutputCommand);
  const hasCustomAudioCommand =
    configuredAudioInputCommand !== void 0 || configuredAudioOutputCommand !== void 0;
  const audioFormat =
    resolveChromeAudioFormat(chrome.audioFormat) ??
    (hasCustomAudioCommand ? "g711-ulaw-8khz" : DEFAULT_GOOGLE_MEET_CONFIG.chrome.audioFormat);
  const audioBufferBytes = resolveAudioBufferBytes(
    chrome.audioBufferBytes,
    DEFAULT_GOOGLE_MEET_CONFIG.chrome.audioBufferBytes,
  );
  const chromeNode = asRecord(raw.chromeNode);
  const twilio = asRecord(raw.twilio);
  const voiceCall = asRecord(raw.voiceCall);
  const realtime = asRecord(raw.realtime);
  const realtimeProvider = normalizeOptionalString$1(realtime.provider);
  const resolvedRealtimeProvider = realtimeProvider ?? DEFAULT_GOOGLE_MEET_CONFIG.realtime.provider;
  const oauth = asRecord(raw.oauth);
  const auth = asRecord(raw.auth);
  return {
    enabled: resolveBoolean(raw.enabled, DEFAULT_GOOGLE_MEET_CONFIG.enabled),
    defaults: {
      meeting:
        normalizeOptionalString$1(defaults.meeting) ??
        readEnvString(env, GOOGLE_MEET_DEFAULT_MEETING_KEYS),
    },
    preview: {
      enrollmentAcknowledged: resolveBoolean(
        preview.enrollmentAcknowledged,
        readEnvBoolean(env, GOOGLE_MEET_PREVIEW_ACK_KEYS) ??
          DEFAULT_GOOGLE_MEET_CONFIG.preview.enrollmentAcknowledged,
      ),
    },
    defaultTransport: resolveTransport(
      raw.defaultTransport,
      DEFAULT_GOOGLE_MEET_CONFIG.defaultTransport,
    ),
    defaultMode: resolveMode(raw.defaultMode, DEFAULT_GOOGLE_MEET_CONFIG.defaultMode),
    chrome: {
      audioBackend: "blackhole-2ch",
      audioFormat,
      audioBufferBytes,
      launch: resolveBoolean(chrome.launch, DEFAULT_GOOGLE_MEET_CONFIG.chrome.launch),
      browserProfile: normalizeOptionalString$1(chrome.browserProfile),
      guestName:
        normalizeOptionalString$1(chrome.guestName) ?? DEFAULT_GOOGLE_MEET_CONFIG.chrome.guestName,
      reuseExistingTab: resolveBoolean(
        chrome.reuseExistingTab,
        DEFAULT_GOOGLE_MEET_CONFIG.chrome.reuseExistingTab,
      ),
      autoJoin: resolveBoolean(chrome.autoJoin, DEFAULT_GOOGLE_MEET_CONFIG.chrome.autoJoin),
      joinTimeoutMs: resolveTimerConfigMs(
        chrome.joinTimeoutMs,
        DEFAULT_GOOGLE_MEET_CONFIG.chrome.joinTimeoutMs,
      ),
      waitForInCallMs: resolveTimerConfigMs(
        chrome.waitForInCallMs,
        DEFAULT_GOOGLE_MEET_CONFIG.chrome.waitForInCallMs,
      ),
      audioInputCommand:
        configuredAudioInputCommand ?? defaultAudioInputCommand(audioFormat, audioBufferBytes),
      audioOutputCommand:
        configuredAudioOutputCommand ?? defaultAudioOutputCommand(audioFormat, audioBufferBytes),
      bargeInInputCommand: resolveStringArray(chrome.bargeInInputCommand),
      bargeInRmsThreshold: resolveNumber(
        chrome.bargeInRmsThreshold,
        DEFAULT_GOOGLE_MEET_CONFIG.chrome.bargeInRmsThreshold,
      ),
      bargeInPeakThreshold: resolveNumber(
        chrome.bargeInPeakThreshold,
        DEFAULT_GOOGLE_MEET_CONFIG.chrome.bargeInPeakThreshold,
      ),
      bargeInCooldownMs: resolveTimerConfigMs(
        chrome.bargeInCooldownMs,
        DEFAULT_GOOGLE_MEET_CONFIG.chrome.bargeInCooldownMs,
      ),
      audioBridgeCommand: resolveStringArray(chrome.audioBridgeCommand),
      audioBridgeHealthCommand: resolveStringArray(chrome.audioBridgeHealthCommand),
    },
    chromeNode: { node: normalizeOptionalString$1(chromeNode.node) },
    twilio: {
      defaultDialInNumber: normalizeOptionalString$1(twilio.defaultDialInNumber),
      defaultPin: normalizeOptionalString$1(twilio.defaultPin),
      defaultDtmfSequence: normalizeOptionalString$1(twilio.defaultDtmfSequence),
    },
    voiceCall: {
      enabled: resolveBoolean(voiceCall.enabled, DEFAULT_GOOGLE_MEET_CONFIG.voiceCall.enabled),
      gatewayUrl: normalizeOptionalString$1(voiceCall.gatewayUrl),
      token: normalizeOptionalString$1(voiceCall.token),
      requestTimeoutMs: resolveTimerConfigMs(
        voiceCall.requestTimeoutMs,
        DEFAULT_GOOGLE_MEET_CONFIG.voiceCall.requestTimeoutMs,
      ),
      dtmfDelayMs: resolveTimerConfigMs(
        voiceCall.dtmfDelayMs,
        DEFAULT_GOOGLE_MEET_CONFIG.voiceCall.dtmfDelayMs,
      ),
      postDtmfSpeechDelayMs: resolveTimerConfigMs(
        voiceCall.postDtmfSpeechDelayMs,
        DEFAULT_GOOGLE_MEET_CONFIG.voiceCall.postDtmfSpeechDelayMs,
      ),
      introMessage: normalizeOptionalString$1(voiceCall.introMessage),
    },
    realtime: {
      strategy: resolveRealtimeStrategy(
        realtime.strategy,
        DEFAULT_GOOGLE_MEET_CONFIG.realtime.strategy,
      ),
      provider: resolvedRealtimeProvider,
      transcriptionProvider:
        normalizeOptionalString$1(realtime.transcriptionProvider) ??
        (realtimeProvider && realtimeProvider !== "google"
          ? resolvedRealtimeProvider
          : DEFAULT_GOOGLE_MEET_CONFIG.realtime.transcriptionProvider),
      voiceProvider: normalizeOptionalString$1(realtime.voiceProvider),
      model: normalizeOptionalString$1(realtime.model) ?? DEFAULT_GOOGLE_MEET_CONFIG.realtime.model,
      instructions:
        normalizeOptionalString$1(realtime.instructions) ??
        DEFAULT_GOOGLE_MEET_CONFIG.realtime.instructions,
      introMessage:
        normalizeStringAllowEmpty(realtime.introMessage) ??
        DEFAULT_GOOGLE_MEET_CONFIG.realtime.introMessage,
      agentId: normalizeOptionalString$1(realtime.agentId),
      toolPolicy: resolveRealtimeVoiceAgentConsultToolPolicy(
        realtime.toolPolicy,
        DEFAULT_GOOGLE_MEET_CONFIG.realtime.toolPolicy,
      ),
      providers: resolveProvidersConfig(realtime.providers),
    },
    oauth: {
      clientId:
        normalizeOptionalString$1(oauth.clientId) ??
        normalizeOptionalString$1(auth.clientId) ??
        readEnvString(env, GOOGLE_MEET_CLIENT_ID_KEYS),
      clientSecret:
        normalizeOptionalString$1(oauth.clientSecret) ??
        normalizeOptionalString$1(auth.clientSecret) ??
        readEnvString(env, GOOGLE_MEET_CLIENT_SECRET_KEYS),
      refreshToken:
        normalizeOptionalString$1(oauth.refreshToken) ??
        readEnvString(env, GOOGLE_MEET_REFRESH_TOKEN_KEYS),
      accessToken:
        normalizeOptionalString$1(oauth.accessToken) ??
        readEnvString(env, GOOGLE_MEET_ACCESS_TOKEN_KEYS),
      expiresAt:
        resolveOptionalNumber(oauth.expiresAt) ??
        readEnvNumber(env, GOOGLE_MEET_ACCESS_TOKEN_EXPIRES_AT_KEYS),
    },
    auth: {
      provider: "google-oauth",
      clientId: normalizeOptionalString$1(auth.clientId),
      clientSecret: normalizeOptionalString$1(auth.clientSecret),
      tokenPath: normalizeOptionalString$1(auth.tokenPath),
    },
  };
}
//#endregion
export {
  buildGoogleMeetCalendarDayWindow as a,
  normalizeMeetUrl as c,
  resolveGoogleMeetGatewayOperationTimeoutMs as i,
  DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND as n,
  findGoogleMeetCalendarEvent as o,
  resolveGoogleMeetConfig as r,
  listGoogleMeetCalendarEvents as s,
  DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND as t,
};
