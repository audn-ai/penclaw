import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { Type } from "typebox";
import { n as normalizeAgentId } from "../../agent-id-DDgUze4y.js";
import {
  _ as fetchGoogleMeetSpace,
  a as forceMeetEnglishUi,
  c as normalizeMeetUrlForReuse,
  d as resolveChromeNodeInfo,
  f as buildGoogleMeetPreflightReport,
  g as fetchGoogleMeetAttendance,
  h as fetchGoogleMeetArtifacts,
  i as callBrowserProxyOnNode,
  l as readBrowserTab,
  m as endGoogleMeetActiveConference,
  n as isGoogleMeetBrowserManualActionError,
  o as isEnglishMeetTab,
  r as asBrowserTabs,
  s as isSameMeetUrlForReuse,
  t as createMeetWithBrowserProxyOnNode,
  u as resolveChromeNode,
  v as fetchLatestGoogleMeetConferenceRecord,
} from "../../chrome-create-nCDvhss8.js";
import { t as GatewayClient } from "../../client-BkZfVL9e.js";
import { t as startGatewayClientWhenEventLoopReady } from "../../client-start-readiness-_Anybv37.js";
import { h as readPositiveIntegerParam } from "../../common-DyDSUect.js";
import {
  a as buildGoogleMeetCalendarDayWindow,
  c as normalizeMeetUrl,
  i as resolveGoogleMeetGatewayOperationTimeoutMs,
  n as DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND,
  o as findGoogleMeetCalendarEvent,
  r as resolveGoogleMeetConfig,
  s as listGoogleMeetCalendarEvents,
  t as DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND,
} from "../../config-BZhHMgj0.js";
import { n as errorShape, t as ErrorCodes } from "../../error-codes-O0AkRNx7.js";
import { r as formatErrorMessage$1 } from "../../errors-BoHeli7m.js";
import { n as callGatewayFromCli } from "../../gateway-rpc-DpocbsVi.js";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
import "../../error-runtime-BIAwr399.js";
import "../../number-runtime-B-n-wjMn.js";
import "../../runtime-env-D0V-7Gqz.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import "../../text-utility-runtime-CJESZCN5.js";
import { a as addTimerTimeoutGraceMs } from "../../number-coercion-CJQ8TR--.js";
import "../../routing-CwvmVRHd.js";
import "../../ssrf-runtime-DJ478vv8.js";
import "../../gateway-runtime-IrTdjV5_.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import "../../channel-actions-C9vNf9jw.js";
import {
  n as getRealtimeTranscriptionProvider,
  r as listRealtimeTranscriptionProviders,
} from "../../provider-registry-zVWdO7IF.js";
import "../../realtime-transcription-DeEtIU2b.js";
import {
  i as resamplePcm,
  l as consultRealtimeVoiceAgent,
  n as mulawToPcm,
  s as createRealtimeVoiceAgentTalkbackQueue,
  t as convertPcmToMulaw8k,
  u as createRealtimeVoiceOutputActivityTracker,
} from "../../realtime-voice-DQqBL-aH.js";
import { a as asRecord$3 } from "../../record-coerce-DHZ4bFlT.js";
import { c as parseAgentSessionKey } from "../../session-key-utils-B8sNp9l4.js";
import {
  A as buildRealtimeVoiceAgentConsultWorkingResponse,
  F as resolveRealtimeVoiceAgentConsultTools,
  H as createTalkSessionController,
  I as resolveRealtimeVoiceAgentConsultToolsAllow,
  Q as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
  W as recordTalkObservabilityEvent,
  Z as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
  a as recordRealtimeVoiceBridgeEvent,
  c as resolveConfiguredRealtimeVoiceProvider,
  i as isLikelyRealtimeVoiceAssistantEchoTranscript,
  n as getRealtimeVoiceBridgeEventHealth,
  o as recordRealtimeVoiceTranscript,
  r as getRealtimeVoiceTranscriptHealth,
  s as createRealtimeVoiceBridgeSession,
  t as extendRealtimeVoiceOutputEchoSuppression,
} from "../../session-log-runtime-DVXN-XFR.js";
import { t as sleep } from "../../sleep-DZm1epyW.js";
import { c as isBlockedHostnameOrIp } from "../../ssrf-keFRGQLq.js";
import { c as normalizeOptionalString } from "../../string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "../../string-normalization-CRyoFBPt.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { a as optionalPositiveIntegerSchema } from "../../typebox-D411BFJf.js";
import { r as truncateUtf16Safe } from "../../utf16-slice-lH-m0h6-.js";
//#region extensions/google-meet/src/transports/chrome-audio-device.ts
const GOOGLE_MEET_SYSTEM_PROFILER_COMMAND = "/usr/sbin/system_profiler";
function outputMentionsBlackHole2ch(output) {
  return /\bBlackHole\s+2ch\b/i.test(output);
}
//#endregion
//#region extensions/google-meet/src/node-host.ts
const sessions = /* @__PURE__ */ new Map();
function readStringArray(value) {
  if (!Array.isArray(value)) return;
  const result = value.filter((entry) => typeof entry === "string" && entry.length > 0);
  return result.length > 0 ? result : void 0;
}
function asRecord$2(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function readString$2(value) {
  return typeof value === "string" && value.length > 0 ? value : void 0;
}
function formatErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function readNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}
function runCommandWithTimeout(argv, timeoutMs) {
  const [command, ...args] = argv;
  if (!command) throw new Error("command must not be empty");
  const result = spawnSync(command, args, {
    encoding: "utf8",
    timeout: timeoutMs,
  });
  return {
    code: typeof result.status === "number" ? result.status : result.error ? 1 : 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? (result.error ? formatErrorMessage(result.error) : ""),
  };
}
function assertBlackHoleAvailable(timeoutMs) {
  if (process.platform !== "darwin")
    throw new Error("Chrome Meet transport with blackhole-2ch audio is currently macOS-only");
  const result = runCommandWithTimeout(
    [GOOGLE_MEET_SYSTEM_PROFILER_COMMAND, "SPAudioDataType"],
    timeoutMs,
  );
  const output = `${result.stdout}\n${result.stderr}`;
  if (result.code !== 0 || !outputMentionsBlackHole2ch(output))
    throw new Error("BlackHole 2ch audio device not found on the node.");
}
function splitCommand$1(argv) {
  const [command, ...args] = argv;
  if (!command) throw new Error("audio command must not be empty");
  return {
    command,
    args,
  };
}
function wake(session) {
  const waiters = session.waiters.splice(0);
  for (const waiter of waiters) waiter();
}
function stopSession(session) {
  if (session.closed) return;
  session.closed = true;
  session.closedAt = /* @__PURE__ */ new Date().toISOString();
  terminateChild(session.input);
  terminateChild(session.output);
  wake(session);
}
function attachOutputProcessHandlers(session, outputProcess) {
  const stopIfCurrent = () => {
    if (session.output === outputProcess) stopSession(session);
  };
  outputProcess.on("exit", stopIfCurrent);
  outputProcess.on("error", stopIfCurrent);
  outputProcess.stdin?.on("error", stopIfCurrent);
  outputProcess.stderr?.on("error", stopIfCurrent);
}
function startOutputProcess(command) {
  return spawn(command.command, command.args, { stdio: ["pipe", "ignore", "pipe"] });
}
function startCommandPair(params) {
  const input = splitCommand$1(params.inputCommand);
  const output = splitCommand$1(params.outputCommand);
  const session = {
    id: `meet_node_${randomUUID()}`,
    url: params.url,
    mode: params.mode,
    outputCommand: output,
    chunks: [],
    waiters: [],
    closed: false,
    createdAt: /* @__PURE__ */ new Date().toISOString(),
    lastInputBytes: 0,
    lastOutputBytes: 0,
    clearCount: 0,
  };
  const outputProcess = startOutputProcess(output);
  const inputProcess = spawn(input.command, input.args, { stdio: ["ignore", "pipe", "pipe"] });
  session.input = inputProcess;
  session.output = outputProcess;
  inputProcess.stdout?.on("data", (chunk) => {
    const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    session.lastInputAt = /* @__PURE__ */ new Date().toISOString();
    session.lastInputBytes += audio.byteLength;
    session.chunks.push(audio);
    if (session.chunks.length > 200) session.chunks.splice(0, session.chunks.length - 200);
    wake(session);
  });
  const stop = () => stopSession(session);
  inputProcess.on("exit", stop);
  inputProcess.on("error", stop);
  inputProcess.stdout?.on("error", stop);
  inputProcess.stderr?.on("error", stop);
  attachOutputProcessHandlers(session, outputProcess);
  sessions.set(session.id, session);
  return session;
}
function terminateChild(child) {
  if (!child) return;
  let exited = child.exitCode !== null || child.signalCode !== null;
  child.once?.("exit", () => {
    exited = true;
  });
  try {
    child.kill("SIGTERM");
  } catch {}
  setTimeout(() => {
    if (exited) return;
    try {
      child.kill("SIGKILL");
    } catch {}
  }, 2e3).unref?.();
}
async function pullAudio(params) {
  const bridgeId = readString$2(params.bridgeId);
  if (!bridgeId) throw new Error("bridgeId required");
  const session = sessions.get(bridgeId);
  if (!session) throw new Error(`unknown bridgeId: ${bridgeId}`);
  const timeoutMs = Math.min(readNumber(params.timeoutMs, 250), 2e3);
  if (session.chunks.length === 0 && !session.closed)
    await Promise.race([
      setTimeout$1(timeoutMs),
      new Promise((resolve) => {
        session.waiters.push(resolve);
      }),
    ]);
  const chunk = session.chunks.shift();
  return {
    bridgeId,
    closed: session.closed,
    base64: chunk ? chunk.toString("base64") : void 0,
  };
}
function pushAudio(params) {
  const bridgeId = readString$2(params.bridgeId);
  const base64 = readString$2(params.base64);
  if (!bridgeId || !base64) throw new Error("bridgeId and base64 required");
  const session = sessions.get(bridgeId);
  if (!session || session.closed) throw new Error(`bridge is not open: ${bridgeId}`);
  const audio = Buffer.from(base64, "base64");
  session.lastOutputAt = /* @__PURE__ */ new Date().toISOString();
  session.lastOutputBytes += audio.byteLength;
  try {
    session.output?.stdin?.write(audio);
  } catch {
    stopSession(session);
    throw new Error(`bridge is not open: ${bridgeId}`);
  }
  return {
    bridgeId,
    ok: true,
  };
}
function clearAudio(params) {
  const bridgeId = readString$2(params.bridgeId);
  if (!bridgeId) throw new Error("bridgeId required");
  const session = sessions.get(bridgeId);
  if (!session || session.closed) throw new Error(`bridge is not open: ${bridgeId}`);
  const previousOutput = session.output;
  const outputProcess = startOutputProcess(session.outputCommand);
  session.output = outputProcess;
  attachOutputProcessHandlers(session, outputProcess);
  session.clearCount += 1;
  session.lastClearAt = /* @__PURE__ */ new Date().toISOString();
  terminateChild(previousOutput);
  return {
    bridgeId,
    ok: true,
    clearCount: session.clearCount,
  };
}
function startChrome(params) {
  const url = normalizeMeetUrl(params.url);
  const timeoutMs = readNumber(params.joinTimeoutMs, 3e4);
  const mode = readString$2(params.mode);
  let bridgeId;
  let audioBridge;
  if (mode === "agent" || mode === "bidi" || mode === "realtime") {
    assertBlackHoleAvailable(Math.min(timeoutMs, 1e4));
    const healthCommand = readStringArray(params.audioBridgeHealthCommand);
    if (healthCommand) {
      const health = runCommandWithTimeout(healthCommand, timeoutMs);
      if (health.code !== 0)
        throw new Error(
          `Chrome audio bridge health check failed: ${health.stderr || health.stdout || health.code}`,
        );
    }
    const bridgeCommand = readStringArray(params.audioBridgeCommand);
    if (bridgeCommand) {
      if (mode === "agent")
        throw new Error(
          "Chrome agent mode requires audioInputCommand and audioOutputCommand so OpenClaw can run STT and regular TTS directly.",
        );
      const bridge = runCommandWithTimeout(bridgeCommand, timeoutMs);
      if (bridge.code !== 0)
        throw new Error(
          `failed to start Chrome audio bridge: ${bridge.stderr || bridge.stdout || bridge.code}`,
        );
      audioBridge = { type: "external-command" };
    } else {
      bridgeId = startCommandPair({
        inputCommand: readStringArray(params.audioInputCommand) ?? [
          ...DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND,
        ],
        outputCommand: readStringArray(params.audioOutputCommand) ?? [
          ...DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND,
        ],
        url,
        mode,
      }).id;
      audioBridge = { type: "node-command-pair" };
    }
  }
  if (params.launch !== false) {
    const argv = ["open", "-a", "Google Chrome", url];
    const browserProfile = readString$2(params.browserProfile);
    if (browserProfile) argv.push("--args", `--profile-directory=${browserProfile}`);
    const result = runCommandWithTimeout(argv, timeoutMs);
    if (result.code !== 0) {
      if (bridgeId) {
        const session = sessions.get(bridgeId);
        if (session) stopSession(session);
      }
      throw new Error(
        `failed to launch Chrome for Meet: ${result.stderr || result.stdout || result.code}`,
      );
    }
  }
  return {
    launched: params.launch !== false,
    bridgeId,
    audioBridge,
    browser:
      params.launch !== false
        ? {
            status: "chrome-opened",
            browserUrl: url,
            notes: [
              "Browser page control is handled by OpenClaw browser automation when using chrome-node.",
            ],
          }
        : void 0,
  };
}
function bridgeStatus(params) {
  const bridgeId = readString$2(params.bridgeId);
  const session = bridgeId ? sessions.get(bridgeId) : void 0;
  return {
    bridge: session
      ? {
          bridgeId,
          closed: session.closed,
          createdAt: session.createdAt,
          lastInputAt: session.lastInputAt,
          lastOutputAt: session.lastOutputAt,
          lastClearAt: session.lastClearAt,
          lastInputBytes: session.lastInputBytes,
          lastOutputBytes: session.lastOutputBytes,
          clearCount: session.clearCount,
          queuedInputChunks: session.chunks.length,
        }
      : bridgeId
        ? {
            bridgeId,
            closed: true,
          }
        : void 0,
  };
}
function normalizeMeetKey(value) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase() !== "meet.google.com") return value;
    return (
      /^\/([a-z]{3}-[a-z]{4}-[a-z]{3})(?:$|[/?#])/i.exec(url.pathname)?.[1]?.toLowerCase() ?? value
    );
  } catch {
    return value;
  }
}
function summarizeSession(session) {
  return {
    bridgeId: session.id,
    url: session.url,
    mode: session.mode,
    closed: session.closed,
    createdAt: session.createdAt,
    closedAt: session.closedAt,
    lastInputAt: session.lastInputAt,
    lastOutputAt: session.lastOutputAt,
    lastInputBytes: session.lastInputBytes,
    lastOutputBytes: session.lastOutputBytes,
  };
}
function listSessions(params) {
  const urlKey = normalizeMeetKey(readString$2(params.url));
  const mode = readString$2(params.mode);
  return {
    bridges: [...sessions.values()]
      .filter((session) => !session.closed)
      .filter((session) => !urlKey || normalizeMeetKey(session.url) === urlKey)
      .filter((session) => !mode || session.mode === mode)
      .map(summarizeSession),
  };
}
function stopSessionsByUrl(params) {
  const urlKey = normalizeMeetKey(readString$2(params.url));
  if (!urlKey) throw new Error("url required");
  const mode = readString$2(params.mode);
  const exceptBridgeId = readString$2(params.exceptBridgeId);
  let stopped = 0;
  for (const [bridgeId, session] of sessions) {
    if (exceptBridgeId && bridgeId === exceptBridgeId) continue;
    if (normalizeMeetKey(session.url) !== urlKey) continue;
    if (mode && session.mode !== mode) continue;
    const wasClosed = session.closed;
    stopSession(session);
    sessions.delete(bridgeId);
    if (!wasClosed) stopped += 1;
  }
  return {
    ok: true,
    stopped,
  };
}
function stopChrome(params) {
  const bridgeId = readString$2(params.bridgeId);
  if (!bridgeId)
    return {
      ok: true,
      stopped: false,
    };
  const session = sessions.get(bridgeId);
  if (!session)
    return {
      ok: true,
      stopped: false,
    };
  stopSession(session);
  sessions.delete(bridgeId);
  return {
    ok: true,
    stopped: true,
  };
}
async function handleGoogleMeetNodeHostCommand(paramsJSON) {
  let raw = {};
  if (paramsJSON)
    try {
      raw = JSON.parse(paramsJSON);
    } catch {
      throw new Error("Google Meet node host received malformed params JSON.");
    }
  const params = asRecord$2(raw);
  const action = readString$2(params.action);
  let result;
  switch (action) {
    case "setup":
      assertBlackHoleAvailable(1e4);
      result = { ok: true };
      break;
    case "start":
      result = startChrome(params);
      break;
    case "status":
      result = bridgeStatus(params);
      break;
    case "list":
      result = listSessions(params);
      break;
    case "stopByUrl":
      result = stopSessionsByUrl(params);
      break;
    case "pullAudio":
      result = await pullAudio(params);
      break;
    case "pushAudio":
      result = pushAudio(params);
      break;
    case "clearAudio":
      result = clearAudio(params);
      break;
    case "stop":
      result = stopChrome(params);
      break;
    default:
      throw new Error("unsupported googlemeet.chrome action");
  }
  return JSON.stringify(result);
}
//#endregion
//#region extensions/google-meet/src/node-invoke-policy.ts
const GOOGLE_MEET_CHROME_NODE_COMMAND = "googlemeet.chrome";
const START_MODES = /* @__PURE__ */ new Set(["agent", "bidi", "realtime", "transcribe"]);
function asRecord$1(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function readString$1(value) {
  return typeof value === "string" && value.length > 0 ? value : void 0;
}
function readPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function copyCommand(command) {
  return command && command.length > 0 ? [...command] : void 0;
}
function denied(message, code = "GOOGLE_MEET_NODE_POLICY_DENIED") {
  return {
    ok: false,
    code,
    message,
  };
}
function approved(params) {
  return {
    approved: true,
    params,
  };
}
function buildStartParams(params, config) {
  let url;
  try {
    url = normalizeMeetUrl(params.url);
  } catch (error) {
    return {
      approved: false,
      result: denied(
        error instanceof Error ? error.message : "googlemeet.chrome start requires url",
      ),
    };
  }
  const mode = readString$1(params.mode);
  if (mode && !START_MODES.has(mode))
    return {
      approved: false,
      result: denied(`googlemeet.chrome start mode is unsupported: ${mode}`),
    };
  const startParams = {
    action: "start",
    url,
    launch: params.launch === false ? false : config.chrome.launch,
    browserProfile: config.chrome.browserProfile,
    joinTimeoutMs: config.chrome.joinTimeoutMs,
  };
  if (mode) startParams.mode = mode;
  const audioInputCommand = copyCommand(config.chrome.audioInputCommand);
  if (audioInputCommand) startParams.audioInputCommand = audioInputCommand;
  const audioOutputCommand = copyCommand(config.chrome.audioOutputCommand);
  if (audioOutputCommand) startParams.audioOutputCommand = audioOutputCommand;
  const audioBridgeCommand = copyCommand(config.chrome.audioBridgeCommand);
  if (audioBridgeCommand) startParams.audioBridgeCommand = audioBridgeCommand;
  const audioBridgeHealthCommand = copyCommand(config.chrome.audioBridgeHealthCommand);
  if (audioBridgeHealthCommand) startParams.audioBridgeHealthCommand = audioBridgeHealthCommand;
  return approved(startParams);
}
function denyMissing(action, field) {
  return {
    approved: false,
    result: denied(`googlemeet.chrome ${action} requires ${field}`),
  };
}
function buildForwardParams(params) {
  const action = readString$1(params.action);
  switch (action) {
    case "setup":
      return approved({ action });
    case "status": {
      const bridgeId = readString$1(params.bridgeId);
      return approved(
        bridgeId
          ? {
              action,
              bridgeId,
            }
          : { action },
      );
    }
    case "list": {
      const forwarded = { action };
      const url = readString$1(params.url);
      const mode = readString$1(params.mode);
      if (url)
        try {
          forwarded.url = normalizeMeetUrl(url);
        } catch (error) {
          return {
            approved: false,
            result: denied(error instanceof Error ? error.message : "googlemeet.chrome list url"),
          };
        }
      if (mode) forwarded.mode = mode;
      return approved(forwarded);
    }
    case "stopByUrl": {
      const forwarded = { action };
      const url = readString$1(params.url);
      const mode = readString$1(params.mode);
      const exceptBridgeId = readString$1(params.exceptBridgeId);
      if (!url) return denyMissing(action, "url");
      try {
        forwarded.url = normalizeMeetUrl(url);
      } catch (error) {
        return {
          approved: false,
          result: denied(
            error instanceof Error ? error.message : "googlemeet.chrome stopByUrl url",
          ),
        };
      }
      if (mode) forwarded.mode = mode;
      if (exceptBridgeId) forwarded.exceptBridgeId = exceptBridgeId;
      return approved(forwarded);
    }
    case "pullAudio": {
      const forwarded = { action };
      const bridgeId = readString$1(params.bridgeId);
      const timeoutMs = readPositiveNumber(params.timeoutMs);
      if (!bridgeId) return denyMissing(action, "bridgeId");
      forwarded.bridgeId = bridgeId;
      if (timeoutMs) forwarded.timeoutMs = timeoutMs;
      return approved(forwarded);
    }
    case "pushAudio": {
      const forwarded = { action };
      const bridgeId = readString$1(params.bridgeId);
      const base64 = readString$1(params.base64);
      if (!bridgeId) return denyMissing(action, "bridgeId");
      if (!base64) return denyMissing(action, "base64");
      forwarded.bridgeId = bridgeId;
      forwarded.base64 = base64;
      return approved(forwarded);
    }
    case "clearAudio": {
      const bridgeId = readString$1(params.bridgeId);
      if (!bridgeId) return denyMissing(action, "bridgeId");
      return approved({
        action,
        bridgeId,
      });
    }
    case "stop": {
      const bridgeId = readString$1(params.bridgeId);
      return approved(
        bridgeId
          ? {
              action,
              bridgeId,
            }
          : { action },
      );
    }
    default:
      return null;
  }
}
function createGoogleMeetChromeNodeInvokePolicy(config) {
  return {
    commands: [GOOGLE_MEET_CHROME_NODE_COMMAND],
    dangerous: true,
    async handle(ctx) {
      if (ctx.command !== "googlemeet.chrome")
        return denied(`unsupported Google Meet node command: ${ctx.command}`);
      const params = asRecord$1(ctx.params);
      const action = readString$1(params.action);
      let decision;
      if (action === "start") decision = buildStartParams(params, config);
      else
        decision = buildForwardParams(params) ?? {
          approved: false,
          result: denied("unsupported googlemeet.chrome action"),
        };
      if (!decision.approved) return decision.result;
      return await ctx.invokeNode({ params: decision.params });
    },
  };
}
//#endregion
//#region extensions/google-meet/src/setup.ts
function resolveUserPath(input) {
  if (input === "~") return os.homedir();
  if (input.startsWith("~/")) return path.join(os.homedir(), input.slice(2));
  return input;
}
function isProviderUnreachableWebhookUrl(webhookUrl) {
  try {
    return isBlockedHostnameOrIp(new URL(webhookUrl).hostname);
  } catch {
    return false;
  }
}
function getVoiceCallWebhookExposureCheck(voiceCallConfig) {
  const publicUrl = normalizeOptionalString(voiceCallConfig.publicUrl);
  const tunnel = asRecord$3(voiceCallConfig.tunnel);
  const tailscale = asRecord$3(voiceCallConfig.tailscale);
  const tunnelProvider = normalizeOptionalString(tunnel.provider);
  const tailscaleMode = normalizeOptionalString(tailscale.mode);
  if (publicUrl) {
    const ok = !isProviderUnreachableWebhookUrl(publicUrl);
    return {
      id: "twilio-voice-call-webhook",
      ok,
      message: ok
        ? `Voice-call public webhook URL configured: ${publicUrl}`
        : `Voice-call publicUrl is local/private and cannot be reached by Twilio: ${publicUrl}`,
    };
  }
  if (tunnelProvider && tunnelProvider !== "none")
    return {
      id: "twilio-voice-call-webhook",
      ok: true,
      message: "Voice-call webhook exposure configured through tunnel",
    };
  if (tailscaleMode && tailscaleMode !== "off")
    return {
      id: "twilio-voice-call-webhook",
      ok: true,
      message: "Voice-call webhook exposure configured through Tailscale",
    };
  return {
    id: "twilio-voice-call-webhook",
    ok: false,
    message:
      "Set plugins.entries.voice-call.config.publicUrl or configure voice-call tunnel/tailscale exposure for Twilio dialing",
  };
}
function getGoogleMeetSetupStatus(config, options) {
  const checks = [];
  const env = options?.env ?? process.env;
  const fullConfig = asRecord$3(options?.fullConfig);
  const mode = options?.mode ?? config.defaultMode;
  const transport = options?.transport ?? config.defaultTransport;
  const needsChromeRealtimeAudio =
    (mode === "agent" || mode === "bidi") &&
    (transport === "chrome" || transport === "chrome-node");
  const pluginEntries = asRecord$3(asRecord$3(fullConfig.plugins).entries);
  const pluginAllow = asRecord$3(fullConfig.plugins).allow;
  const voiceCallEntry = asRecord$3(pluginEntries["voice-call"]);
  const voiceCallConfig = asRecord$3(voiceCallEntry.config);
  const voiceCallTwilioConfig = asRecord$3(voiceCallConfig.twilio);
  if (config.auth.tokenPath) {
    const tokenPath = resolveUserPath(config.auth.tokenPath);
    checks.push({
      id: "google-oauth-token",
      ok: fs.existsSync(tokenPath),
      message: fs.existsSync(tokenPath)
        ? "Google OAuth token file found"
        : `Google OAuth token file missing at ${config.auth.tokenPath}`,
    });
  } else
    checks.push({
      id: "google-oauth-token",
      ok: true,
      message: "Google OAuth token path not configured; Chrome profile auth will be used",
    });
  checks.push({
    id: "chrome-profile",
    ok: true,
    message: config.chrome.browserProfile
      ? "Local Chrome uses the OpenClaw browser profile; chrome.browserProfile is passed to chrome-node hosts"
      : "Local Chrome uses the OpenClaw browser profile; configure browser.defaultProfile to choose another profile",
  });
  if (needsChromeRealtimeAudio) {
    const hasCommandPair = Boolean(
      config.chrome.audioInputCommand && config.chrome.audioOutputCommand,
    );
    const hasExternalBridge = Boolean(config.chrome.audioBridgeCommand);
    const agentModeExternalBridgeInvalid = mode === "agent" && hasExternalBridge;
    checks.push({
      id: "audio-bridge",
      ok:
        mode === "agent"
          ? hasCommandPair && !agentModeExternalBridgeInvalid
          : hasExternalBridge || hasCommandPair,
      message: agentModeExternalBridgeInvalid
        ? "Chrome agent mode requires chrome.audioInputCommand and chrome.audioOutputCommand; chrome.audioBridgeCommand is bidi-only"
        : hasExternalBridge
          ? "Chrome audio bridge command configured"
          : hasCommandPair
            ? `Chrome command-pair talk-back audio bridge configured (${config.chrome.audioFormat})`
            : "Chrome talk-back audio bridge not configured",
    });
  } else if (transport === "chrome" || transport === "chrome-node")
    checks.push({
      id: "audio-bridge",
      ok: true,
      message: "Chrome observe-only mode does not require a realtime audio bridge",
    });
  checks.push({
    id: "guest-join-defaults",
    ok: Boolean(
      config.chrome.guestName && config.chrome.autoJoin && config.chrome.reuseExistingTab,
    ),
    message:
      config.chrome.guestName && config.chrome.autoJoin && config.chrome.reuseExistingTab
        ? "Guest auto-join and tab reuse defaults are enabled"
        : "Set chrome.guestName, chrome.autoJoin, and chrome.reuseExistingTab for unattended guest joins",
  });
  checks.push({
    id: "chrome-node-target",
    ok: config.defaultTransport !== "chrome-node" || Boolean(config.chromeNode.node),
    message:
      config.defaultTransport === "chrome-node" && !config.chromeNode.node
        ? "chrome-node default should pin chromeNode.node when multiple nodes may be connected"
        : config.chromeNode.node
          ? `Chrome node pinned to ${config.chromeNode.node}`
          : "Chrome node not pinned; automatic selection works when exactly one capable node is connected",
  });
  if (needsChromeRealtimeAudio)
    checks.push({
      id: "intro-after-in-call",
      ok: config.chrome.waitForInCallMs > 0,
      message:
        config.chrome.waitForInCallMs > 0
          ? `Realtime intro waits up to ${config.chrome.waitForInCallMs}ms for the Meet tab to be in-call`
          : "Set chrome.waitForInCallMs to delay realtime intro until the Meet tab is in-call",
    });
  if (transport === "twilio") {
    const hasRequestDialPlan = Boolean(options?.twilioDialInNumber);
    const hasDefaultDialPlan = Boolean(config.twilio.defaultDialInNumber);
    const hasDialPlan = hasRequestDialPlan || hasDefaultDialPlan;
    checks.push({
      id: "twilio-dial-plan",
      ok: hasDialPlan,
      message: hasRequestDialPlan
        ? "Twilio request includes a Meet dial-in number"
        : hasDefaultDialPlan
          ? "Twilio default Meet dial-in number is configured"
          : "Twilio joins require a Meet dial-in phone number; pass dialInNumber with optional pin/dtmfSequence or configure twilio.defaultDialInNumber",
    });
  }
  if (
    config.voiceCall.enabled &&
    (transport === "twilio" ||
      Boolean(config.twilio.defaultDialInNumber) ||
      Object.hasOwn(pluginEntries, "voice-call"))
  ) {
    const voiceCallAllowed = !Array.isArray(pluginAllow) || pluginAllow.includes("voice-call");
    const voiceCallEnabled =
      Object.hasOwn(pluginEntries, "voice-call") && voiceCallEntry.enabled !== false;
    checks.push({
      id: "twilio-voice-call-plugin",
      ok: voiceCallAllowed && voiceCallEnabled,
      message:
        voiceCallAllowed && voiceCallEnabled
          ? "Twilio transport can delegate dialing to the voice-call plugin"
          : "Enable plugins.entries.voice-call and include voice-call in plugins.allow for Twilio dialing",
    });
    if ((normalizeOptionalString(voiceCallConfig.provider) ?? "twilio") === "twilio") {
      const accountSid = normalizeOptionalString(voiceCallTwilioConfig.accountSid);
      const authToken = normalizeOptionalString(voiceCallTwilioConfig.authToken);
      const fromNumber = normalizeOptionalString(voiceCallConfig.fromNumber);
      const twilioReady = Boolean(
        (accountSid || env.TWILIO_ACCOUNT_SID) &&
        (authToken || env.TWILIO_AUTH_TOKEN) &&
        (fromNumber || env.TWILIO_FROM_NUMBER),
      );
      checks.push({
        id: "twilio-voice-call-credentials",
        ok: twilioReady,
        message: twilioReady
          ? "Twilio voice-call credentials are configured"
          : "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER or configure voice-call Twilio credentials",
      });
      checks.push(getVoiceCallWebhookExposureCheck(voiceCallConfig));
    }
  }
  return {
    ok: checks.every((check) => check.ok),
    checks,
  };
}
function addGoogleMeetSetupCheck(status, check) {
  const checks = [...status.checks, check];
  return {
    ok: checks.every((item) => item.ok),
    checks,
  };
}
//#endregion
//#region extensions/google-meet/src/agent-consult.ts
const GOOGLE_MEET_CONSULT_SYSTEM_PROMPT = [
  "You are a behind-the-scenes consultant for a live meeting voice agent.",
  "Prioritize a fast, speakable answer over exhaustive investigation.",
  "For tool-backed status checks, prefer one or two bounded read-only queries before answering.",
  "Do not print secret values or dump environment variables; only check whether required configuration is present.",
  "Be accurate, brief, and speakable.",
].join(" ");
function resolveGoogleMeetRealtimeTools(policy) {
  return resolveRealtimeVoiceAgentConsultTools(policy);
}
async function submitGoogleMeetConsultWorkingResponse(session, callId) {
  if (!session.bridge.supportsToolResultContinuation) return;
  await session.submitToolResult(
    callId,
    buildRealtimeVoiceAgentConsultWorkingResponse("participant"),
    { willContinue: true },
  );
}
async function consultOpenClawAgentForGoogleMeet(params) {
  const agentId = normalizeAgentId(params.config.realtime.agentId);
  const requesterSessionKey =
    normalizeOptionalString(params.requesterSessionKey) ?? `agent:${agentId}:main`;
  const sessionKey = `agent:${agentId}:subagent:google-meet:${params.meetingSessionId}`;
  return await consultRealtimeVoiceAgent({
    cfg: params.fullConfig,
    agentRuntime: params.runtime.agent,
    logger: params.logger,
    agentId,
    sessionKey,
    messageProvider: "google-meet",
    lane: "google-meet",
    runIdPrefix: `google-meet:${params.meetingSessionId}`,
    spawnedBy: requesterSessionKey,
    contextMode: "fork",
    args: params.args,
    transcript: params.transcript,
    surface: "a private Google Meet",
    userLabel: "Participant",
    assistantLabel: "Agent",
    questionSourceLabel: "participant",
    toolsAllow: resolveRealtimeVoiceAgentConsultToolsAllow(params.config.realtime.toolPolicy),
    extraSystemPrompt: GOOGLE_MEET_CONSULT_SYSTEM_PROMPT,
  });
}
async function handleGoogleMeetRealtimeConsultToolCall(params) {
  const callId = params.event.callId || params.event.itemId;
  if (params.strategy !== "bidi") {
    const error = `Tool "${params.event.name}" is only available in bidi realtime strategy`;
    await params.session.submitToolResult(callId, { error });
    params.onTalkEvent?.({
      type: "tool.error",
      callId,
      payload: {
        name: params.event.name,
        error,
      },
      final: true,
    });
    return;
  }
  if (params.event.name !== "openclaw_agent_consult") {
    const error = `Tool "${params.event.name}" not available`;
    await params.session.submitToolResult(callId, { error });
    params.onTalkEvent?.({
      type: "tool.error",
      callId,
      payload: {
        name: params.event.name,
        error,
      },
      final: true,
    });
    return;
  }
  await submitGoogleMeetConsultWorkingResponse(params.session, callId);
  params.onTalkEvent?.({
    type: "tool.progress",
    callId,
    payload: {
      name: params.event.name,
      status: "working",
    },
  });
  let result;
  try {
    result = await consultOpenClawAgentForGoogleMeet({
      config: params.config,
      fullConfig: params.fullConfig,
      runtime: params.runtime,
      logger: params.logger,
      meetingSessionId: params.meetingSessionId,
      requesterSessionKey: params.requesterSessionKey,
      args: params.event.args,
      transcript: params.transcript,
    });
  } catch (error) {
    const message = formatErrorMessage$1(error);
    await params.session.submitToolResult(callId, { error: message });
    params.onTalkEvent?.({
      type: "tool.error",
      callId,
      payload: {
        name: params.event.name,
        error: message,
      },
      final: true,
    });
    return;
  }
  await params.session.submitToolResult(callId, result);
  params.onTalkEvent?.({
    type: "tool.result",
    callId,
    payload: {
      name: params.event.name,
      result,
    },
    final: true,
  });
}
//#endregion
//#region extensions/google-meet/src/realtime.ts
function terminateBridgeProcess(proc, signal = "SIGTERM") {
  if (proc.killed && signal !== "SIGKILL") return;
  let exited = false;
  proc.on("exit", () => {
    exited = true;
  });
  try {
    proc.kill(signal);
  } catch {
    return;
  }
  if (signal === "SIGKILL") return;
  setTimeout(() => {
    if (!exited)
      try {
        proc.kill("SIGKILL");
      } catch {}
  }, 1e3).unref?.();
}
const recordGoogleMeetRealtimeTranscript = recordRealtimeVoiceTranscript;
function getGoogleMeetRealtimeTranscriptHealth(transcript) {
  return getRealtimeVoiceTranscriptHealth(transcript);
}
const GOOGLE_MEET_OUTPUT_ECHO_SUPPRESSION_TAIL_MS = 3e3;
const GOOGLE_MEET_TRANSCRIPT_ECHO_LOOKBACK_MS = 45e3;
function recordGoogleMeetRealtimeEvent(events, event) {
  recordRealtimeVoiceBridgeEvent(events, event);
}
function getGoogleMeetRealtimeEventHealth(events) {
  return getRealtimeVoiceBridgeEventHealth(events);
}
function splitCommand(argv) {
  const [command, ...args] = argv;
  if (!command) throw new Error("audio bridge command must not be empty");
  return {
    command,
    args,
  };
}
function readPcm16Stats(audio) {
  let sumSquares = 0;
  let peak = 0;
  let samples = 0;
  for (let offset = 0; offset + 1 < audio.byteLength; offset += 2) {
    const sample = audio.readInt16LE(offset);
    peak = Math.max(peak, Math.abs(sample));
    sumSquares += sample * sample;
    samples += 1;
  }
  return {
    rms: samples > 0 ? Math.sqrt(sumSquares / samples) : 0,
    peak,
  };
}
function isGoogleMeetLikelyAssistantEchoTranscript(params) {
  return isLikelyRealtimeVoiceAssistantEchoTranscript({
    ...params,
    lookbackMs: GOOGLE_MEET_TRANSCRIPT_ECHO_LOOKBACK_MS,
  });
}
function extendGoogleMeetOutputEchoSuppression(params) {
  const bytesPerMs = params.audioFormat === "g711-ulaw-8khz" ? 8 : 48;
  return extendRealtimeVoiceOutputEchoSuppression({
    ...params,
    bytesPerMs,
    tailMs: GOOGLE_MEET_OUTPUT_ECHO_SUPPRESSION_TAIL_MS,
  });
}
function recordGoogleMeetOutputActivity(params) {
  const suppression = extendGoogleMeetOutputEchoSuppression(params);
  params.tracker.markPlaybackStarted();
  params.tracker.markAudio({
    audioMs: suppression.durationMs,
    sourceAudioBytes: params.audio.byteLength,
    sinkAudioBytes: params.audio.byteLength,
  });
  return suppression;
}
function resolveGoogleMeetRealtimeAudioFormat(config) {
  return config.chrome.audioFormat === "g711-ulaw-8khz"
    ? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ
    : REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ;
}
function convertGoogleMeetBridgeAudioForStt(audio, config) {
  if (config.chrome.audioFormat === "g711-ulaw-8khz") return audio;
  return convertPcmToMulaw8k(audio, 24e3);
}
function convertGoogleMeetTtsAudioForBridge(audio, sampleRate, config, outputFormat) {
  const sourceFormat = sourceTelephonyTtsFormat(outputFormat);
  if (
    config.chrome.audioFormat === "g711-ulaw-8khz" &&
    sourceFormat === "mulaw" &&
    sampleRate === 8e3
  )
    return audio;
  const pcm = decodeGoogleMeetTelephonyTtsAudio(audio, sourceFormat);
  return config.chrome.audioFormat === "g711-ulaw-8khz"
    ? convertPcmToMulaw8k(pcm, sampleRate)
    : resamplePcm(pcm, sampleRate, 24e3);
}
function sourceTelephonyTtsFormat(outputFormat) {
  const normalized = outputFormat?.trim().toLowerCase().replaceAll("_", "-") ?? "";
  if (
    !normalized ||
    normalized === "pcm" ||
    normalized.startsWith("pcm-") ||
    normalized.includes("pcm16") ||
    normalized.includes("16bit-mono-pcm")
  )
    return "pcm";
  if (
    normalized === "mulaw" ||
    normalized === "ulaw" ||
    normalized.includes("mu-law") ||
    normalized.includes("mulaw") ||
    normalized.includes("ulaw")
  )
    return "mulaw";
  if (normalized === "alaw" || normalized.includes("a-law") || normalized.includes("alaw"))
    return "alaw";
  throw new Error(`Unsupported telephony TTS output format for Google Meet: ${outputFormat}`);
}
function decodeGoogleMeetTelephonyTtsAudio(audio, sourceFormat) {
  switch (sourceFormat) {
    case "pcm":
      return audio;
    case "mulaw":
      return mulawToPcm(audio);
    case "alaw":
      return alawToPcm(audio);
  }
  return unsupportedGoogleMeetTelephonyTtsFormat(sourceFormat);
}
function unsupportedGoogleMeetTelephonyTtsFormat(_format) {
  throw new Error("Unsupported telephony TTS output format for Google Meet");
}
function alawToPcm(alaw) {
  const pcm = Buffer.alloc(alaw.length * 2);
  for (let index = 0; index < alaw.length; index += 1)
    pcm.writeInt16LE(alawByteToLinear(alaw[index] ?? 0), index * 2);
  return pcm;
}
function alawByteToLinear(value) {
  const aLaw = value ^ 85;
  const sign = aLaw & 128;
  const exponent = (aLaw & 112) >> 4;
  const mantissa = aLaw & 15;
  const sample = exponent === 0 ? (mantissa << 4) + 8 : ((mantissa << 4) + 264) << (exponent - 1);
  return sign ? sample : -sample;
}
function resolveGoogleMeetRealtimeProvider(params) {
  return resolveConfiguredRealtimeVoiceProvider({
    configuredProviderId: params.config.realtime.voiceProvider ?? params.config.realtime.provider,
    providerConfigs: params.config.realtime.providers,
    cfg: params.fullConfig,
    providers: params.providers,
    defaultModel: params.config.realtime.model,
    noRegisteredProviderMessage: "No configured realtime voice provider registered",
  });
}
function resolveGoogleMeetRealtimeTranscriptionProvider(params) {
  const providers = params.providers ?? listRealtimeTranscriptionProviders(params.fullConfig);
  if (providers.length === 0)
    throw new Error("No configured realtime transcription provider registered");
  const providerId =
    params.config.realtime.transcriptionProvider ?? params.config.realtime.provider;
  const provider =
    (providerId
      ? (params.providers?.find(
          (entry) => entry.id === providerId || entry.aliases?.includes(providerId),
        ) ?? getRealtimeTranscriptionProvider(providerId, params.fullConfig))
      : void 0) ?? providers[0];
  if (!provider) throw new Error("No configured realtime transcription provider registered");
  const rawConfig = providerId
    ? (params.config.realtime.providers[providerId] ??
      params.config.realtime.providers[provider.id] ??
      {})
    : (params.config.realtime.providers[provider.id] ?? {});
  const providerConfig = provider.resolveConfig
    ? provider.resolveConfig({
        cfg: params.fullConfig,
        rawConfig,
      })
    : rawConfig;
  if (
    !provider.isConfigured({
      cfg: params.fullConfig,
      providerConfig,
    })
  )
    throw new Error(`Realtime transcription provider "${provider.id}" is not configured`);
  return {
    provider,
    providerConfig,
  };
}
function buildGoogleMeetSpeakExactUserMessage(text) {
  return [
    "Speak this exact OpenClaw answer to the meeting, without adding, removing, or rephrasing words.",
    `Answer: ${JSON.stringify(text)}`,
  ].join("\n");
}
function readLogString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function formatLogValue(value) {
  return (value ? truncateUtf16Safe(value.replace(/\s+/g, "_"), 180) : void 0) || "unknown";
}
function resolveProviderModelForLog(params) {
  return (
    readLogString(params.providerConfig.model) ??
    readLogString(params.providerConfig.modelId) ??
    readLogString(params.fallbackModel) ??
    readLogString(params.provider.defaultModel) ??
    "provider-default"
  );
}
function formatGoogleMeetRealtimeVoiceModelLog(params) {
  return [
    `[google-meet] realtime voice bridge starting: strategy=${formatLogValue(params.strategy)}`,
    `provider=${formatLogValue(params.provider.id)}`,
    `model=${formatLogValue(
      resolveProviderModelForLog({
        provider: params.provider,
        providerConfig: params.providerConfig,
        fallbackModel: params.fallbackModel,
      }),
    )}`,
    `audioFormat=${formatLogValue(params.audioFormat)}`,
  ].join(" ");
}
function formatGoogleMeetAgentAudioModelLog(params) {
  return [
    `[google-meet] agent audio bridge starting: transcriptionProvider=${formatLogValue(params.provider.id)}`,
    `transcriptionModel=${formatLogValue(
      resolveProviderModelForLog({
        provider: params.provider,
        providerConfig: params.providerConfig,
      }),
    )}`,
    "tts=telephony",
    `audioFormat=${formatLogValue(params.audioFormat)}`,
  ].join(" ");
}
function formatGoogleMeetAgentTtsResultLog(prefix, result) {
  return [
    `[google-meet] ${prefix} TTS: provider=${formatLogValue(result.provider)}`,
    `model=${formatLogValue(result.providerModel)}`,
    `voice=${formatLogValue(result.providerVoice)}`,
    `outputFormat=${formatLogValue(result.outputFormat)}`,
    `sampleRate=${result.sampleRate ?? "unknown"}`,
    ...(result.fallbackFrom ? [`fallbackFrom=${formatLogValue(result.fallbackFrom)}`] : []),
  ].join(" ");
}
function formatGoogleMeetTranscriptSummaryLog(prefix, text) {
  return `[google-meet] ${prefix}: chars=${text.length}`;
}
function normalizeGoogleMeetTtsPromptText$1(text) {
  const trimmed = text?.trim();
  if (!trimmed) return;
  const sayExactly = trimmed.match(/^say exactly:\s*(?<text>.+)$/is)?.groups?.text?.trim();
  if (sayExactly) return sayExactly.replace(/^["']|["']$/g, "").trim() || trimmed;
  return trimmed;
}
function pushGoogleMeetTalkEvent(events, event, maxEntries = 40) {
  events.push(event);
  if (events.length > maxEntries) events.splice(0, events.length - maxEntries);
}
function summarizeGoogleMeetTalkEvents(events) {
  return events.slice(-20).map((event) => ({
    id: event.id,
    type: event.type,
    sessionId: event.sessionId,
    turnId: event.turnId,
    seq: event.seq,
    timestamp: event.timestamp,
    final: event.final,
  }));
}
async function startCommandAgentAudioBridge(params) {
  const input = splitCommand(params.inputCommand);
  const output = splitCommand(params.outputCommand);
  const spawnFn = params.spawn ?? ((command, args, options) => spawn(command, args, options));
  const outputProcess = spawnFn(output.command, output.args, { stdio: ["pipe", "ignore", "pipe"] });
  const inputProcess = spawnFn(input.command, input.args, { stdio: ["ignore", "pipe", "pipe"] });
  let stopped = false;
  let sttSession = null;
  let realtimeReady = false;
  let lastInputAt;
  let lastOutputAt;
  let lastInputBytes = 0;
  const outputActivity = createRealtimeVoiceOutputActivityTracker();
  let suppressedInputBytes = 0;
  let lastSuppressedInputAt;
  let suppressInputUntil = 0;
  let lastOutputPlayableUntilMs = 0;
  let ttsQueue = Promise.resolve();
  const transcript = [];
  const resolved = resolveGoogleMeetRealtimeTranscriptionProvider({
    config: params.config,
    fullConfig: params.fullConfig,
    providers: params.providers,
  });
  const talk = createTalkSessionController(
    {
      sessionId: `google-meet:${params.meetingSessionId}:agent`,
      mode: "stt-tts",
      transport: "gateway-relay",
      brain: "agent-consult",
      provider: resolved.provider.id,
      turnIdPrefix: `google-meet:${params.meetingSessionId}:turn`,
    },
    { onEvent: recordTalkObservabilityEvent },
  );
  const recentTalkEvents = [];
  const emitTalkEvent = (inputResult) =>
    pushGoogleMeetTalkEvent(recentTalkEvents, talk.emit(inputResult));
  const ensureTalkTurn = () => {
    const turn = talk.ensureTurn({ payload: { meetingSessionId: params.meetingSessionId } });
    if (turn.event) pushGoogleMeetTalkEvent(recentTalkEvents, turn.event);
    return turn.turnId;
  };
  const endTalkTurn = () => {
    const ended = talk.endTurn({ payload: { meetingSessionId: params.meetingSessionId } });
    if (ended.ok) pushGoogleMeetTalkEvent(recentTalkEvents, ended.event);
  };
  params.logger.info(
    formatGoogleMeetAgentAudioModelLog({
      provider: resolved.provider,
      providerConfig: resolved.providerConfig,
      audioFormat: params.config.chrome.audioFormat,
    }),
  );
  const stop = async () => {
    if (stopped) return;
    stopped = true;
    agentTalkback?.close();
    try {
      sttSession?.close();
    } catch (error) {
      params.logger.debug?.(
        `[google-meet] agent transcription bridge close ignored: ${formatErrorMessage$1(error)}`,
      );
    }
    emitTalkEvent({
      type: "session.closed",
      final: true,
      payload: { meetingSessionId: params.meetingSessionId },
    });
    terminateBridgeProcess(inputProcess);
    terminateBridgeProcess(outputProcess);
  };
  const fail = (label) => (error) => {
    params.logger.warn(`[google-meet] ${label} failed: ${formatErrorMessage$1(error)}`);
    stop();
  };
  inputProcess.on("error", fail("audio input command"));
  inputProcess.on("exit", (code, signal) => {
    if (!stopped) {
      params.logger.warn(`[google-meet] audio input command exited (${code ?? signal ?? "done"})`);
      stop();
    }
  });
  inputProcess.stderr?.on("data", (chunk) => {
    params.logger.debug?.(`[google-meet] audio input: ${String(chunk).trim()}`);
  });
  inputProcess.stdout?.on("error", fail("audio input command stdout"));
  inputProcess.stderr?.on("error", fail("audio input command stderr"));
  outputProcess.on("error", fail("audio output command"));
  outputProcess.stdin?.on?.("error", fail("audio output command"));
  outputProcess.on("exit", (code, signal) => {
    if (!stopped) {
      params.logger.warn(`[google-meet] audio output command exited (${code ?? signal ?? "done"})`);
      stop();
    }
  });
  outputProcess.stderr?.on("data", (chunk) => {
    params.logger.debug?.(`[google-meet] audio output: ${String(chunk).trim()}`);
  });
  outputProcess.stderr?.on("error", fail("audio output command stderr"));
  const writeOutputAudio = (audio) => {
    const suppression = recordGoogleMeetOutputActivity({
      tracker: outputActivity,
      audio,
      audioFormat: params.config.chrome.audioFormat,
      nowMs: Date.now(),
      lastOutputPlayableUntilMs,
      suppressInputUntilMs: suppressInputUntil,
    });
    suppressInputUntil = suppression.suppressInputUntilMs;
    lastOutputPlayableUntilMs = suppression.lastOutputPlayableUntilMs;
    lastOutputAt = /* @__PURE__ */ new Date().toISOString();
    emitTalkEvent({
      type: "output.audio.delta",
      turnId: ensureTalkTurn(),
      payload: {
        meetingSessionId: params.meetingSessionId,
        bytes: audio.byteLength,
      },
    });
    try {
      outputProcess.stdin?.write(audio);
    } catch (error) {
      fail("audio output command")(error);
    }
  };
  const enqueueSpeakText = (text) => {
    const normalized = normalizeGoogleMeetTtsPromptText$1(text);
    if (!normalized || stopped) return;
    ttsQueue = ttsQueue
      .then(async () => {
        if (stopped) return;
        recordGoogleMeetRealtimeTranscript(transcript, "assistant", normalized);
        params.logger.info(formatGoogleMeetTranscriptSummaryLog("agent assistant", normalized));
        const turnId = ensureTalkTurn();
        emitTalkEvent({
          type: "output.text.done",
          turnId,
          final: true,
          payload: {
            meetingSessionId: params.meetingSessionId,
            text: normalized,
          },
        });
        const result = await params.runtime.tts.textToSpeechTelephony({
          text: normalized,
          cfg: params.fullConfig,
        });
        if (!result.success || !result.audioBuffer || !result.sampleRate)
          throw new Error(result.error ?? "TTS conversion failed");
        params.logger.info(formatGoogleMeetAgentTtsResultLog("agent", result));
        emitTalkEvent({
          type: "output.audio.started",
          turnId,
          payload: { meetingSessionId: params.meetingSessionId },
        });
        writeOutputAudio(
          convertGoogleMeetTtsAudioForBridge(
            result.audioBuffer,
            result.sampleRate,
            params.config,
            result.outputFormat,
          ),
        );
        emitTalkEvent({
          type: "output.audio.done",
          turnId,
          final: true,
          payload: { meetingSessionId: params.meetingSessionId },
        });
        endTalkTurn();
      })
      .catch((error) => {
        params.logger.warn(`[google-meet] agent TTS failed: ${formatErrorMessage$1(error)}`);
      });
  };
  const agentTalkback = createRealtimeVoiceAgentTalkbackQueue({
    debounceMs: 900,
    isStopped: () => stopped,
    logger: params.logger,
    logPrefix: "[google-meet] agent",
    responseStyle: "Brief, natural spoken answer for a live meeting.",
    fallbackText: "I hit an error while checking that. Please try again.",
    consult: ({ question, responseStyle }) =>
      consultOpenClawAgentForGoogleMeet({
        config: params.config,
        fullConfig: params.fullConfig,
        runtime: params.runtime,
        logger: params.logger,
        meetingSessionId: params.meetingSessionId,
        requesterSessionKey: params.requesterSessionKey,
        args: {
          question,
          responseStyle,
        },
        transcript,
      }),
    deliver: enqueueSpeakText,
  });
  sttSession = resolved.provider.createSession({
    cfg: params.fullConfig,
    providerConfig: resolved.providerConfig,
    onTranscript: (text) => {
      const trimmed = text.trim();
      if (!trimmed || stopped) return;
      const turnId = ensureTalkTurn();
      emitTalkEvent({
        type: "input.audio.committed",
        turnId,
        final: true,
        payload: { meetingSessionId: params.meetingSessionId },
      });
      emitTalkEvent({
        type: "transcript.done",
        turnId,
        final: true,
        payload: {
          meetingSessionId: params.meetingSessionId,
          text: trimmed,
          role: "user",
        },
      });
      recordGoogleMeetRealtimeTranscript(transcript, "user", trimmed);
      params.logger.info(formatGoogleMeetTranscriptSummaryLog("agent user", trimmed));
      if (
        isGoogleMeetLikelyAssistantEchoTranscript({
          transcript,
          text: trimmed,
        })
      ) {
        params.logger.info(
          formatGoogleMeetTranscriptSummaryLog("agent ignored assistant echo transcript", trimmed),
        );
        return;
      }
      agentTalkback?.enqueue(trimmed);
    },
    onError: (error) => {
      params.logger.warn(
        `[google-meet] agent transcription bridge failed: ${formatErrorMessage$1(error)}`,
      );
      emitTalkEvent({
        type: "session.error",
        final: true,
        payload: {
          meetingSessionId: params.meetingSessionId,
          error: formatErrorMessage$1(error),
        },
      });
      stop();
    },
  });
  emitTalkEvent({
    type: "session.started",
    payload: {
      meetingSessionId: params.meetingSessionId,
      provider: resolved.provider.id,
    },
  });
  await sttSession.connect();
  realtimeReady = true;
  emitTalkEvent({
    type: "session.ready",
    payload: { meetingSessionId: params.meetingSessionId },
  });
  inputProcess.stdout?.on("data", (chunk) => {
    if (stopped) return;
    const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    if (Date.now() < suppressInputUntil) {
      lastSuppressedInputAt = /* @__PURE__ */ new Date().toISOString();
      suppressedInputBytes += audio.byteLength;
      return;
    }
    lastInputAt = /* @__PURE__ */ new Date().toISOString();
    lastInputBytes += audio.byteLength;
    emitTalkEvent({
      type: "input.audio.delta",
      turnId: ensureTalkTurn(),
      payload: {
        meetingSessionId: params.meetingSessionId,
        bytes: audio.byteLength,
      },
    });
    sttSession?.sendAudio(convertGoogleMeetBridgeAudioForStt(audio, params.config));
  });
  return {
    providerId: resolved.provider.id,
    inputCommand: params.inputCommand,
    outputCommand: params.outputCommand,
    speak: enqueueSpeakText,
    getHealth: () => ({
      providerConnected: sttSession?.isConnected() ?? false,
      realtimeReady,
      audioInputActive: lastInputBytes > 0,
      audioOutputActive: outputActivity.isActive(),
      lastInputAt,
      lastOutputAt,
      lastSuppressedInputAt,
      lastInputBytes,
      lastOutputBytes: outputActivity.snapshot().sinkAudioBytes,
      suppressedInputBytes,
      ...getGoogleMeetRealtimeTranscriptHealth(transcript),
      recentTalkEvents: summarizeGoogleMeetTalkEvents(recentTalkEvents),
      bridgeClosed: stopped,
    }),
    stop,
  };
}
async function startCommandRealtimeAudioBridge(params) {
  const input = splitCommand(params.inputCommand);
  const output = splitCommand(params.outputCommand);
  const spawnFn = params.spawn ?? ((command, args, options) => spawn(command, args, options));
  const spawnOutputProcess = () =>
    spawnFn(output.command, output.args, { stdio: ["pipe", "ignore", "pipe"] });
  let outputProcess = spawnOutputProcess();
  const inputProcess = spawnFn(input.command, input.args, { stdio: ["ignore", "pipe", "pipe"] });
  let stopped = false;
  let bridge = null;
  let realtimeReady = false;
  let lastInputAt;
  let lastOutputAt;
  let lastInputBytes = 0;
  const outputActivity = createRealtimeVoiceOutputActivityTracker();
  let lastClearAt;
  let clearCount = 0;
  let suppressedInputBytes = 0;
  let lastSuppressedInputAt;
  let suppressInputUntil = 0;
  let lastOutputPlayableUntilMs = 0;
  let bargeInInputProcess;
  const suppressInputForOutput = (audio) => {
    const suppression = recordGoogleMeetOutputActivity({
      tracker: outputActivity,
      audio,
      audioFormat: params.config.chrome.audioFormat,
      nowMs: Date.now(),
      lastOutputPlayableUntilMs,
      suppressInputUntilMs: suppressInputUntil,
    });
    suppressInputUntil = suppression.suppressInputUntilMs;
    lastOutputPlayableUntilMs = suppression.lastOutputPlayableUntilMs;
  };
  const stop = async () => {
    if (stopped) return;
    stopped = true;
    agentTalkback?.close();
    try {
      bridge?.close();
    } catch (error) {
      params.logger.debug?.(
        `[google-meet] realtime voice bridge close ignored: ${formatErrorMessage$1(error)}`,
      );
    }
    terminateBridgeProcess(inputProcess);
    terminateBridgeProcess(outputProcess);
    if (bargeInInputProcess) terminateBridgeProcess(bargeInInputProcess);
  };
  const fail = (label) => (error) => {
    params.logger.warn(`[google-meet] ${label} failed: ${formatErrorMessage$1(error)}`);
    stop();
  };
  const attachOutputProcessHandlers = (proc) => {
    proc.on("error", (error) => {
      if (proc !== outputProcess) return;
      fail("audio output command")(error);
    });
    proc.stdin?.on?.("error", (error) => {
      if (proc !== outputProcess) return;
      fail("audio output command")(error);
    });
    proc.on("exit", (code, signal) => {
      if (proc !== outputProcess) return;
      if (!stopped) {
        params.logger.warn(
          `[google-meet] audio output command exited (${code ?? signal ?? "done"})`,
        );
        stop();
      }
    });
    proc.stderr?.on("data", (chunk) => {
      params.logger.debug?.(`[google-meet] audio output: ${String(chunk).trim()}`);
    });
    proc.stderr?.on("error", (error) => {
      if (proc !== outputProcess) return;
      fail("audio output command stderr")(error);
    });
  };
  const clearOutputPlayback = () => {
    if (stopped) return;
    const previousOutput = outputProcess;
    outputProcess = spawnOutputProcess();
    attachOutputProcessHandlers(outputProcess);
    clearCount += 1;
    lastClearAt = /* @__PURE__ */ new Date().toISOString();
    suppressInputUntil = 0;
    lastOutputPlayableUntilMs = 0;
    params.logger.debug?.(
      `[google-meet] cleared realtime audio output buffer by restarting playback command`,
    );
    terminateBridgeProcess(previousOutput, "SIGKILL");
  };
  const writeOutputAudio = (audio) => {
    try {
      outputProcess.stdin?.write(audio);
    } catch (error) {
      fail("audio output command")(error);
    }
  };
  const startHumanBargeInMonitor = () => {
    const commandArgv = params.config.chrome.bargeInInputCommand;
    if (!commandArgv) return;
    const command = splitCommand(commandArgv);
    let lastBargeInAt = 0;
    bargeInInputProcess = spawnFn(command.command, command.args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    bargeInInputProcess.stdout?.on("data", (chunk) => {
      if (stopped || !outputActivity.isInterruptible()) return;
      const now = Date.now();
      const playbackActive = now <= Math.max(lastOutputPlayableUntilMs, suppressInputUntil);
      const lastOutputAudioAt = outputActivity.snapshot().lastAudioAt;
      if (!playbackActive && (lastOutputAudioAt === void 0 || now - lastOutputAudioAt > 1e3))
        return;
      if (now - lastBargeInAt < params.config.chrome.bargeInCooldownMs) return;
      const stats = readPcm16Stats(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      if (
        stats.rms < params.config.chrome.bargeInRmsThreshold &&
        stats.peak < params.config.chrome.bargeInPeakThreshold
      )
        return;
      lastBargeInAt = now;
      suppressInputUntil = 0;
      const beforeClearCount = clearCount;
      bridge?.handleBargeIn({ audioPlaybackActive: true });
      if (beforeClearCount === clearCount) clearOutputPlayback();
      params.logger.debug?.(
        `[google-meet] human barge-in detected by local input (rms=${Math.round(stats.rms)}, peak=${stats.peak})`,
      );
    });
    bargeInInputProcess.stdout?.on("error", (error) => {
      params.logger.warn(
        `[google-meet] human barge-in input stdout failed: ${formatErrorMessage$1(error)}`,
      );
    });
    bargeInInputProcess.stderr?.on("data", (chunk) => {
      params.logger.debug?.(`[google-meet] barge-in input: ${String(chunk).trim()}`);
    });
    bargeInInputProcess.stderr?.on("error", (error) => {
      params.logger.warn(
        `[google-meet] human barge-in input stderr failed: ${formatErrorMessage$1(error)}`,
      );
    });
    bargeInInputProcess.on("error", (error) => {
      params.logger.warn(
        `[google-meet] human barge-in input failed: ${formatErrorMessage$1(error)}`,
      );
    });
    bargeInInputProcess.on("exit", (code, signal) => {
      if (!stopped)
        params.logger.debug?.(
          `[google-meet] human barge-in input exited (${code ?? signal ?? "done"})`,
        );
    });
  };
  inputProcess.on("error", fail("audio input command"));
  inputProcess.on("exit", (code, signal) => {
    if (!stopped) {
      params.logger.warn(`[google-meet] audio input command exited (${code ?? signal ?? "done"})`);
      stop();
    }
  });
  attachOutputProcessHandlers(outputProcess);
  inputProcess.stderr?.on("data", (chunk) => {
    params.logger.debug?.(`[google-meet] audio input: ${String(chunk).trim()}`);
  });
  inputProcess.stdout?.on("error", fail("audio input command stdout"));
  inputProcess.stderr?.on("error", fail("audio input command stderr"));
  const resolved = resolveGoogleMeetRealtimeProvider({
    config: params.config,
    fullConfig: params.fullConfig,
    providers: params.providers,
  });
  const strategy = params.config.realtime.strategy;
  params.logger.info(
    formatGoogleMeetRealtimeVoiceModelLog({
      strategy,
      provider: resolved.provider,
      providerConfig: resolved.providerConfig,
      fallbackModel: params.config.realtime.model,
      audioFormat: params.config.chrome.audioFormat,
    }),
  );
  const transcript = [];
  const realtimeEvents = [];
  const talk = createTalkSessionController(
    {
      sessionId: `google-meet:${params.meetingSessionId}:command-realtime`,
      mode: "realtime",
      transport: "gateway-relay",
      brain: strategy === "bidi" ? "direct-tools" : "agent-consult",
      provider: resolved.provider.id,
    },
    { onEvent: recordTalkObservabilityEvent },
  );
  const recentTalkEvents = [];
  const rememberTalkEvent = (event) => {
    if (event) pushGoogleMeetTalkEvent(recentTalkEvents, event);
  };
  const emitTalkEvent = (inputValue) => {
    rememberTalkEvent(talk.emit(inputValue));
  };
  const ensureTalkTurn = () => {
    const turn = talk.ensureTurn({ payload: { meetingSessionId: params.meetingSessionId } });
    if (turn.event) rememberTalkEvent(turn.event);
    return turn.turnId;
  };
  const finishOutputAudio = (reason) => {
    rememberTalkEvent(talk.finishOutputAudio({ payload: { reason } }));
  };
  const endTalkTurn = (reason = "completed") => {
    const ended = talk.endTurn({ payload: { reason } });
    if (ended.ok) rememberTalkEvent(ended.event);
  };
  emitTalkEvent({
    type: "session.started",
    payload: { meetingSessionId: params.meetingSessionId },
  });
  const agentTalkback = createRealtimeVoiceAgentTalkbackQueue({
    debounceMs: 900,
    isStopped: () => stopped,
    logger: params.logger,
    logPrefix: "[google-meet] realtime agent",
    responseStyle: "Brief, natural spoken answer for a live meeting.",
    fallbackText: "I hit an error while checking that. Please try again.",
    consult: ({ question, responseStyle }) =>
      consultOpenClawAgentForGoogleMeet({
        config: params.config,
        fullConfig: params.fullConfig,
        runtime: params.runtime,
        logger: params.logger,
        meetingSessionId: params.meetingSessionId,
        requesterSessionKey: params.requesterSessionKey,
        args: {
          question,
          responseStyle,
        },
        transcript,
      }),
    deliver: (text) => {
      bridge?.sendUserMessage(buildGoogleMeetSpeakExactUserMessage(text));
    },
  });
  bridge = createRealtimeVoiceBridgeSession({
    provider: resolved.provider,
    cfg: params.fullConfig,
    providerConfig: resolved.providerConfig,
    audioFormat: resolveGoogleMeetRealtimeAudioFormat(params.config),
    instructions: params.config.realtime.instructions,
    initialGreetingInstructions: params.config.realtime.introMessage,
    autoRespondToAudio: strategy === "bidi",
    triggerGreetingOnReady: false,
    markStrategy: "ack-immediately",
    tools:
      strategy === "bidi" ? resolveGoogleMeetRealtimeTools(params.config.realtime.toolPolicy) : [],
    audioSink: {
      isOpen: () => !stopped,
      sendAudio: (audio) => {
        const turnId = ensureTalkTurn();
        rememberTalkEvent(
          talk.startOutputAudio({
            turnId,
            payload: { meetingSessionId: params.meetingSessionId },
          }).event,
        );
        emitTalkEvent({
          type: "output.audio.delta",
          turnId,
          payload: { byteLength: audio.byteLength },
        });
        lastOutputAt = /* @__PURE__ */ new Date().toISOString();
        suppressInputForOutput(audio);
        writeOutputAudio(audio);
      },
      clearAudio: () => {
        clearOutputPlayback();
        finishOutputAudio("clear");
      },
    },
    onTranscript: (role, text, isFinal) => {
      const turnId = ensureTalkTurn();
      emitTalkEvent({
        type:
          role === "assistant"
            ? isFinal
              ? "output.text.done"
              : "output.text.delta"
            : isFinal
              ? "transcript.done"
              : "transcript.delta",
        turnId,
        payload:
          role === "assistant"
            ? { text }
            : {
                role,
                text,
              },
        final: isFinal,
      });
      if (role === "user" && isFinal)
        emitTalkEvent({
          type: "input.audio.committed",
          turnId,
          payload: { meetingSessionId: params.meetingSessionId },
          final: true,
        });
      if (isFinal) {
        recordGoogleMeetRealtimeTranscript(transcript, role, text);
        params.logger.info(formatGoogleMeetTranscriptSummaryLog(`realtime ${role}`, text));
        if (role === "user" && strategy === "agent") {
          if (
            isGoogleMeetLikelyAssistantEchoTranscript({
              transcript,
              text,
            })
          ) {
            params.logger.info(
              formatGoogleMeetTranscriptSummaryLog(
                "realtime ignored assistant echo transcript",
                text,
              ),
            );
            return;
          }
          agentTalkback?.enqueue(text);
        }
      }
    },
    onEvent: (event) => {
      recordGoogleMeetRealtimeEvent(realtimeEvents, event);
      if (event.type === "input_audio_buffer.speech_started") ensureTalkTurn();
      else if (event.type === "input_audio_buffer.speech_stopped") {
        const turnId = talk.activeTurnId;
        if (!turnId) return;
        emitTalkEvent({
          type: "input.audio.committed",
          turnId,
          payload: {
            meetingSessionId: params.meetingSessionId,
            source: event.type,
          },
          final: true,
        });
      } else if (event.type === "response.done") {
        finishOutputAudio("response.done");
        endTalkTurn("response.done");
      } else if (event.type === "error")
        emitTalkEvent({
          type: "session.error",
          payload: { message: event.detail ?? "Realtime provider error" },
          final: true,
        });
      if (
        event.type === "error" ||
        event.type === "response.done" ||
        event.type === "input_audio_buffer.speech_started" ||
        event.type === "input_audio_buffer.speech_stopped" ||
        event.type === "conversation.item.input_audio_transcription.completed" ||
        event.type === "conversation.item.input_audio_transcription.failed"
      ) {
        const detail = event.detail ? ` ${event.detail}` : "";
        params.logger.info(`[google-meet] realtime ${event.direction}:${event.type}${detail}`);
      }
    },
    onToolCall: (event, session) => {
      emitTalkEvent({
        type: "tool.call",
        turnId: ensureTalkTurn(),
        itemId: event.itemId,
        callId: event.callId,
        payload: {
          name: event.name,
          args: event.args,
        },
      });
      const turnId = ensureTalkTurn();
      return handleGoogleMeetRealtimeConsultToolCall({
        strategy,
        session,
        event,
        config: params.config,
        fullConfig: params.fullConfig,
        runtime: params.runtime,
        logger: params.logger,
        meetingSessionId: params.meetingSessionId,
        requesterSessionKey: params.requesterSessionKey,
        transcript,
        onTalkEvent: (inputLocal) =>
          emitTalkEvent({
            ...inputLocal,
            turnId: inputLocal.turnId ?? turnId,
          }),
      });
    },
    onError: (error) => {
      emitTalkEvent({
        type: "session.error",
        payload: { message: formatErrorMessage$1(error) },
        final: true,
      });
      fail("realtime voice bridge")(error);
    },
    onClose: (reason) => {
      realtimeReady = false;
      finishOutputAudio(reason);
      emitTalkEvent({
        type: "session.closed",
        payload: { reason },
        final: true,
      });
      if (reason === "error") stop();
    },
    onReady: () => {
      realtimeReady = true;
      emitTalkEvent({
        type: "session.ready",
        payload: { meetingSessionId: params.meetingSessionId },
      });
    },
  });
  startHumanBargeInMonitor();
  inputProcess.stdout?.on("data", (chunk) => {
    const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    if (!stopped && audio.byteLength > 0) {
      if (Date.now() < suppressInputUntil) {
        lastSuppressedInputAt = /* @__PURE__ */ new Date().toISOString();
        suppressedInputBytes += audio.byteLength;
        return;
      }
      lastInputAt = /* @__PURE__ */ new Date().toISOString();
      lastInputBytes += audio.byteLength;
      emitTalkEvent({
        type: "input.audio.delta",
        turnId: ensureTalkTurn(),
        payload: { byteLength: audio.byteLength },
      });
      bridge?.sendAudio(Buffer.from(audio));
    }
  });
  await bridge.connect();
  return {
    providerId: resolved.provider.id,
    inputCommand: params.inputCommand,
    outputCommand: params.outputCommand,
    speak: (instructions) => {
      bridge?.triggerGreeting(instructions);
    },
    getHealth: () => ({
      providerConnected: bridge?.bridge.isConnected() ?? false,
      realtimeReady,
      audioInputActive: lastInputBytes > 0,
      audioOutputActive: outputActivity.isActive(),
      lastInputAt,
      lastOutputAt,
      lastSuppressedInputAt,
      lastInputBytes,
      lastOutputBytes: outputActivity.snapshot().sinkAudioBytes,
      suppressedInputBytes,
      ...getGoogleMeetRealtimeTranscriptHealth(transcript),
      ...getGoogleMeetRealtimeEventHealth(realtimeEvents),
      recentTalkEvents: summarizeGoogleMeetTalkEvents(recentTalkEvents),
      lastClearAt,
      clearCount,
      bridgeClosed: stopped,
    }),
    stop,
  };
}
//#endregion
//#region extensions/google-meet/src/realtime-node.ts
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function readString(value) {
  return typeof value === "string" && value.trim() ? value : void 0;
}
function normalizeGoogleMeetTtsPromptText(text) {
  const trimmed = text?.trim();
  if (!trimmed) return;
  const sayExactly = trimmed.match(/^say exactly:\s*(?<text>.+)$/is)?.groups?.text?.trim();
  if (sayExactly) return sayExactly.replace(/^["']|["']$/g, "").trim() || trimmed;
  return trimmed;
}
function startGoogleMeetNodeAudioInputLoop(params) {
  let lastInputAt;
  let lastInputBytes = 0;
  let suppressedInputBytes = 0;
  let lastSuppressedInputAt;
  let consecutiveInputErrors = 0;
  let lastInputError;
  (async () => {
    for (;;) {
      if (params.isStopped()) break;
      try {
        const raw = await params.runtime.nodes.invoke({
          nodeId: params.nodeId,
          command: "googlemeet.chrome",
          params: {
            action: "pullAudio",
            bridgeId: params.bridgeId,
            timeoutMs: 250,
          },
          timeoutMs: 2e3,
        });
        const result = asRecord(asRecord(raw).payload ?? raw);
        consecutiveInputErrors = 0;
        lastInputError = void 0;
        const base64 = readString(result.base64);
        if (base64) {
          const audio = Buffer.from(base64, "base64");
          if (params.isInputSuppressed()) {
            lastSuppressedInputAt = /* @__PURE__ */ new Date().toISOString();
            suppressedInputBytes += audio.byteLength;
            continue;
          }
          lastInputAt = /* @__PURE__ */ new Date().toISOString();
          lastInputBytes += audio.byteLength;
          params.onAudio(audio);
        }
        if (result.closed === true) await params.stop();
      } catch (error) {
        if (!params.isStopped()) {
          const message = formatErrorMessage$1(error);
          consecutiveInputErrors += 1;
          lastInputError = message;
          params.logger.warn(
            `[google-meet] ${params.logPrefix} audio input failed (${consecutiveInputErrors}/5): ${message}`,
          );
          if (consecutiveInputErrors >= 5 || /unknown bridgeId|bridge is not open/i.test(message))
            await params.stop();
          else
            await new Promise((resolve) => {
              setTimeout(resolve, 250);
            });
        }
      }
    }
  })();
  return {
    getHealth: () => ({
      audioInputActive: lastInputBytes > 0,
      lastInputAt,
      lastSuppressedInputAt,
      lastInputBytes,
      suppressedInputBytes,
      consecutiveInputErrors,
      lastInputError,
    }),
  };
}
async function startNodeAgentAudioBridge(params) {
  let stopped = false;
  let sttSession = null;
  let realtimeReady = false;
  let lastOutputAt;
  const outputActivity = createRealtimeVoiceOutputActivityTracker();
  let suppressInputUntil = 0;
  let lastOutputPlayableUntilMs = 0;
  const resolved = resolveGoogleMeetRealtimeTranscriptionProvider({
    config: params.config,
    fullConfig: params.fullConfig,
    providers: params.providers,
  });
  params.logger.info(
    formatGoogleMeetAgentAudioModelLog({
      provider: resolved.provider,
      providerConfig: resolved.providerConfig,
      audioFormat: params.config.chrome.audioFormat,
    }),
  );
  const transcript = [];
  let ttsQueue = Promise.resolve();
  const stop = async () => {
    if (stopped) return;
    stopped = true;
    agentTalkback?.close();
    try {
      sttSession?.close();
    } catch (error) {
      params.logger.debug?.(
        `[google-meet] node agent transcription bridge close ignored: ${formatErrorMessage$1(error)}`,
      );
    }
    try {
      await params.runtime.nodes.invoke({
        nodeId: params.nodeId,
        command: "googlemeet.chrome",
        params: {
          action: "stop",
          bridgeId: params.bridgeId,
        },
        timeoutMs: 5e3,
      });
    } catch (error) {
      params.logger.debug?.(
        `[google-meet] node audio bridge stop ignored: ${formatErrorMessage$1(error)}`,
      );
    }
  };
  const pushOutputAudio = async (audio) => {
    const suppression = recordGoogleMeetOutputActivity({
      tracker: outputActivity,
      audio,
      audioFormat: params.config.chrome.audioFormat,
      nowMs: Date.now(),
      lastOutputPlayableUntilMs,
      suppressInputUntilMs: suppressInputUntil,
    });
    suppressInputUntil = suppression.suppressInputUntilMs;
    lastOutputPlayableUntilMs = suppression.lastOutputPlayableUntilMs;
    lastOutputAt = /* @__PURE__ */ new Date().toISOString();
    await params.runtime.nodes.invoke({
      nodeId: params.nodeId,
      command: "googlemeet.chrome",
      params: {
        action: "pushAudio",
        bridgeId: params.bridgeId,
        base64: Buffer.from(audio).toString("base64"),
      },
      timeoutMs: 5e3,
    });
  };
  const enqueueSpeakText = (text) => {
    const normalized = normalizeGoogleMeetTtsPromptText(text);
    if (!normalized || stopped) return;
    ttsQueue = ttsQueue
      .then(async () => {
        if (stopped) return;
        recordGoogleMeetRealtimeTranscript(transcript, "assistant", normalized);
        params.logger.info(
          formatGoogleMeetTranscriptSummaryLog("node agent assistant", normalized),
        );
        const result = await params.runtime.tts.textToSpeechTelephony({
          text: normalized,
          cfg: params.fullConfig,
        });
        if (!result.success || !result.audioBuffer || !result.sampleRate)
          throw new Error(result.error ?? "TTS conversion failed");
        params.logger.info(formatGoogleMeetAgentTtsResultLog("node agent", result));
        await pushOutputAudio(
          convertGoogleMeetTtsAudioForBridge(
            result.audioBuffer,
            result.sampleRate,
            params.config,
            result.outputFormat,
          ),
        );
      })
      .catch((error) => {
        params.logger.warn(`[google-meet] node agent TTS failed: ${formatErrorMessage$1(error)}`);
      });
  };
  const agentTalkback = createRealtimeVoiceAgentTalkbackQueue({
    debounceMs: 900,
    isStopped: () => stopped,
    logger: params.logger,
    logPrefix: "[google-meet] node agent",
    responseStyle: "Brief, natural spoken answer for a live meeting.",
    fallbackText: "I hit an error while checking that. Please try again.",
    consult: ({ question, responseStyle }) =>
      consultOpenClawAgentForGoogleMeet({
        config: params.config,
        fullConfig: params.fullConfig,
        runtime: params.runtime,
        logger: params.logger,
        meetingSessionId: params.meetingSessionId,
        requesterSessionKey: params.requesterSessionKey,
        args: {
          question,
          responseStyle,
        },
        transcript,
      }),
    deliver: enqueueSpeakText,
  });
  sttSession = resolved.provider.createSession({
    cfg: params.fullConfig,
    providerConfig: resolved.providerConfig,
    onTranscript: (text) => {
      const trimmed = text.trim();
      if (!trimmed || stopped) return;
      recordGoogleMeetRealtimeTranscript(transcript, "user", trimmed);
      params.logger.info(formatGoogleMeetTranscriptSummaryLog("node agent user", trimmed));
      if (
        isGoogleMeetLikelyAssistantEchoTranscript({
          transcript,
          text: trimmed,
        })
      ) {
        params.logger.info(
          formatGoogleMeetTranscriptSummaryLog(
            "node agent ignored assistant echo transcript",
            trimmed,
          ),
        );
        return;
      }
      agentTalkback?.enqueue(trimmed);
    },
    onError: (error) => {
      params.logger.warn(
        `[google-meet] node agent transcription bridge failed: ${formatErrorMessage$1(error)}`,
      );
      stop();
    },
  });
  await sttSession.connect();
  realtimeReady = true;
  const audioInputLoop = startGoogleMeetNodeAudioInputLoop({
    runtime: params.runtime,
    nodeId: params.nodeId,
    bridgeId: params.bridgeId,
    logger: params.logger,
    logPrefix: "node agent",
    isStopped: () => stopped,
    stop,
    isInputSuppressed: () => Date.now() < suppressInputUntil,
    onAudio: (audio) => {
      sttSession?.sendAudio(convertGoogleMeetBridgeAudioForStt(audio, params.config));
    },
  });
  return {
    type: "node-command-pair",
    providerId: resolved.provider.id,
    nodeId: params.nodeId,
    bridgeId: params.bridgeId,
    speak: enqueueSpeakText,
    getHealth: () => ({
      providerConnected: sttSession?.isConnected() ?? false,
      realtimeReady,
      ...audioInputLoop.getHealth(),
      audioOutputActive: outputActivity.isActive(),
      lastOutputAt,
      lastOutputBytes: outputActivity.snapshot().sinkAudioBytes,
      ...getGoogleMeetRealtimeTranscriptHealth(transcript),
      bridgeClosed: stopped,
    }),
    stop,
  };
}
async function startNodeRealtimeAudioBridge(params) {
  let stopped = false;
  let bridge = null;
  let realtimeReady = false;
  let lastOutputAt;
  let lastClearAt;
  const outputActivity = createRealtimeVoiceOutputActivityTracker();
  let suppressInputUntil = 0;
  let lastOutputPlayableUntilMs = 0;
  let clearCount = 0;
  const resolved = resolveGoogleMeetRealtimeProvider({
    config: params.config,
    fullConfig: params.fullConfig,
    providers: params.providers,
  });
  const transcript = [];
  const realtimeEvents = [];
  const strategy = params.config.realtime.strategy;
  const talk = createTalkSessionController(
    {
      sessionId: `google-meet:${params.meetingSessionId}:${params.bridgeId}:node-realtime`,
      mode: "realtime",
      transport: "gateway-relay",
      brain: strategy === "bidi" ? "direct-tools" : "agent-consult",
      provider: resolved.provider.id,
    },
    { onEvent: recordTalkObservabilityEvent },
  );
  const recentTalkEvents = [];
  const rememberTalkEvent = (event) => {
    if (event) pushGoogleMeetTalkEvent(recentTalkEvents, event);
  };
  const emitTalkEvent = (input) => {
    rememberTalkEvent(talk.emit(input));
  };
  const ensureTalkTurn = () => {
    const turn = talk.ensureTurn({
      payload: {
        bridgeId: params.bridgeId,
        meetingSessionId: params.meetingSessionId,
      },
    });
    if (turn.event) rememberTalkEvent(turn.event);
    return turn.turnId;
  };
  const finishOutputAudio = (reason) => {
    rememberTalkEvent(
      talk.finishOutputAudio({
        payload: {
          bridgeId: params.bridgeId,
          reason,
        },
      }),
    );
  };
  const endTalkTurn = (reason = "completed") => {
    const ended = talk.endTurn({
      payload: {
        bridgeId: params.bridgeId,
        reason,
      },
    });
    if (ended.ok) rememberTalkEvent(ended.event);
  };
  emitTalkEvent({
    type: "session.started",
    payload: {
      bridgeId: params.bridgeId,
      meetingSessionId: params.meetingSessionId,
      nodeId: params.nodeId,
    },
  });
  params.logger.info(
    formatGoogleMeetRealtimeVoiceModelLog({
      strategy,
      provider: resolved.provider,
      providerConfig: resolved.providerConfig,
      fallbackModel: params.config.realtime.model,
      audioFormat: params.config.chrome.audioFormat,
    }),
  );
  const agentTalkback = createRealtimeVoiceAgentTalkbackQueue({
    debounceMs: 900,
    isStopped: () => stopped,
    logger: params.logger,
    logPrefix: "[google-meet] node realtime agent",
    responseStyle: "Brief, natural spoken answer for a live meeting.",
    fallbackText: "I hit an error while checking that. Please try again.",
    consult: ({ question, responseStyle }) =>
      consultOpenClawAgentForGoogleMeet({
        config: params.config,
        fullConfig: params.fullConfig,
        runtime: params.runtime,
        logger: params.logger,
        meetingSessionId: params.meetingSessionId,
        requesterSessionKey: params.requesterSessionKey,
        args: {
          question,
          responseStyle,
        },
        transcript,
      }),
    deliver: (text) => {
      bridge?.sendUserMessage(buildGoogleMeetSpeakExactUserMessage(text));
    },
  });
  const stop = async () => {
    if (stopped) return;
    stopped = true;
    agentTalkback?.close();
    try {
      bridge?.close();
    } catch (error) {
      params.logger.debug?.(
        `[google-meet] node realtime bridge close ignored: ${formatErrorMessage$1(error)}`,
      );
    }
    try {
      await params.runtime.nodes.invoke({
        nodeId: params.nodeId,
        command: "googlemeet.chrome",
        params: {
          action: "stop",
          bridgeId: params.bridgeId,
        },
        timeoutMs: 5e3,
      });
    } catch (error) {
      params.logger.debug?.(
        `[google-meet] node audio bridge stop ignored: ${formatErrorMessage$1(error)}`,
      );
    }
  };
  bridge = createRealtimeVoiceBridgeSession({
    provider: resolved.provider,
    cfg: params.fullConfig,
    providerConfig: resolved.providerConfig,
    audioFormat: resolveGoogleMeetRealtimeAudioFormat(params.config),
    instructions: params.config.realtime.instructions,
    initialGreetingInstructions: params.config.realtime.introMessage,
    autoRespondToAudio: strategy === "bidi",
    triggerGreetingOnReady: false,
    markStrategy: "ack-immediately",
    tools:
      strategy === "bidi" ? resolveGoogleMeetRealtimeTools(params.config.realtime.toolPolicy) : [],
    audioSink: {
      isOpen: () => !stopped,
      sendAudio: (audio) => {
        const turnId = ensureTalkTurn();
        rememberTalkEvent(
          talk.startOutputAudio({
            turnId,
            payload: { bridgeId: params.bridgeId },
          }).event,
        );
        emitTalkEvent({
          type: "output.audio.delta",
          turnId,
          payload: { byteLength: audio.byteLength },
        });
        const suppression = recordGoogleMeetOutputActivity({
          tracker: outputActivity,
          audio,
          audioFormat: params.config.chrome.audioFormat,
          nowMs: Date.now(),
          lastOutputPlayableUntilMs,
          suppressInputUntilMs: suppressInputUntil,
        });
        suppressInputUntil = suppression.suppressInputUntilMs;
        lastOutputPlayableUntilMs = suppression.lastOutputPlayableUntilMs;
        lastOutputAt = /* @__PURE__ */ new Date().toISOString();
        params.runtime.nodes
          .invoke({
            nodeId: params.nodeId,
            command: "googlemeet.chrome",
            params: {
              action: "pushAudio",
              bridgeId: params.bridgeId,
              base64: Buffer.from(audio).toString("base64"),
            },
            timeoutMs: 5e3,
          })
          .catch((error) => {
            params.logger.warn(
              `[google-meet] node audio output failed: ${formatErrorMessage$1(error)}`,
            );
            stop();
          });
      },
      clearAudio: () => {
        lastClearAt = /* @__PURE__ */ new Date().toISOString();
        clearCount += 1;
        finishOutputAudio("clear");
        suppressInputUntil = 0;
        lastOutputPlayableUntilMs = 0;
        params.runtime.nodes
          .invoke({
            nodeId: params.nodeId,
            command: "googlemeet.chrome",
            params: {
              action: "clearAudio",
              bridgeId: params.bridgeId,
            },
            timeoutMs: 5e3,
          })
          .catch((error) => {
            params.logger.warn(
              `[google-meet] node audio clear failed: ${formatErrorMessage$1(error)}`,
            );
            stop();
          });
      },
    },
    onTranscript: (role, text, isFinal) => {
      const turnId = ensureTalkTurn();
      emitTalkEvent({
        type:
          role === "assistant"
            ? isFinal
              ? "output.text.done"
              : "output.text.delta"
            : isFinal
              ? "transcript.done"
              : "transcript.delta",
        turnId,
        payload:
          role === "assistant"
            ? { text }
            : {
                role,
                text,
              },
        final: isFinal,
      });
      if (role === "user" && isFinal)
        emitTalkEvent({
          type: "input.audio.committed",
          turnId,
          payload: { bridgeId: params.bridgeId },
          final: true,
        });
      if (isFinal) {
        recordGoogleMeetRealtimeTranscript(transcript, role, text);
        params.logger.info(formatGoogleMeetTranscriptSummaryLog(`node realtime ${role}`, text));
        if (role === "user" && strategy === "agent") {
          if (
            isGoogleMeetLikelyAssistantEchoTranscript({
              transcript,
              text,
            })
          ) {
            params.logger.info(
              formatGoogleMeetTranscriptSummaryLog(
                "node realtime ignored assistant echo transcript",
                text,
              ),
            );
            return;
          }
          agentTalkback?.enqueue(text);
        }
      }
    },
    onEvent: (event) => {
      recordGoogleMeetRealtimeEvent(realtimeEvents, event);
      if (event.type === "input_audio_buffer.speech_started") ensureTalkTurn();
      else if (event.type === "input_audio_buffer.speech_stopped") {
        const turnId = talk.activeTurnId;
        if (!turnId) return;
        emitTalkEvent({
          type: "input.audio.committed",
          turnId,
          payload: {
            bridgeId: params.bridgeId,
            source: event.type,
          },
          final: true,
        });
      } else if (event.type === "response.done") {
        finishOutputAudio("response.done");
        endTalkTurn("response.done");
      } else if (event.type === "error")
        emitTalkEvent({
          type: "session.error",
          payload: { message: event.detail ?? "Realtime provider error" },
          final: true,
        });
      if (
        event.type === "error" ||
        event.type === "response.done" ||
        event.type === "input_audio_buffer.speech_started" ||
        event.type === "input_audio_buffer.speech_stopped" ||
        event.type === "conversation.item.input_audio_transcription.completed" ||
        event.type === "conversation.item.input_audio_transcription.failed"
      ) {
        const detail = event.detail ? ` ${event.detail}` : "";
        params.logger.info(`[google-meet] node realtime ${event.direction}:${event.type}${detail}`);
      }
    },
    onToolCall: (event, session) => {
      emitTalkEvent({
        type: "tool.call",
        turnId: ensureTalkTurn(),
        itemId: event.itemId,
        callId: event.callId,
        payload: {
          name: event.name,
          args: event.args,
        },
      });
      const turnId = ensureTalkTurn();
      return handleGoogleMeetRealtimeConsultToolCall({
        strategy,
        session,
        event,
        config: params.config,
        fullConfig: params.fullConfig,
        runtime: params.runtime,
        logger: params.logger,
        meetingSessionId: params.meetingSessionId,
        requesterSessionKey: params.requesterSessionKey,
        transcript,
        onTalkEvent: (input) =>
          emitTalkEvent({
            ...input,
            turnId: input.turnId ?? turnId,
          }),
      });
    },
    onError: (error) => {
      params.logger.warn(
        `[google-meet] node realtime voice bridge failed: ${formatErrorMessage$1(error)}`,
      );
      emitTalkEvent({
        type: "session.error",
        payload: { message: formatErrorMessage$1(error) },
        final: true,
      });
      stop();
    },
    onClose: (reason) => {
      realtimeReady = false;
      finishOutputAudio(reason);
      emitTalkEvent({
        type: "session.closed",
        payload: { reason },
        final: true,
      });
      if (reason === "error") stop();
    },
    onReady: () => {
      realtimeReady = true;
      emitTalkEvent({
        type: "session.ready",
        payload: { bridgeId: params.bridgeId },
      });
    },
  });
  await bridge.connect();
  const audioInputLoop = startGoogleMeetNodeAudioInputLoop({
    runtime: params.runtime,
    nodeId: params.nodeId,
    bridgeId: params.bridgeId,
    logger: params.logger,
    logPrefix: "node",
    isStopped: () => stopped,
    stop,
    isInputSuppressed: () => Date.now() < suppressInputUntil,
    onAudio: (audio) => {
      emitTalkEvent({
        type: "input.audio.delta",
        turnId: ensureTalkTurn(),
        payload: { byteLength: audio.byteLength },
      });
      bridge?.sendAudio(audio);
    },
  });
  return {
    type: "node-command-pair",
    providerId: resolved.provider.id,
    nodeId: params.nodeId,
    bridgeId: params.bridgeId,
    speak: (instructions) => {
      bridge?.triggerGreeting(instructions);
    },
    getHealth: () => ({
      providerConnected: bridge?.bridge.isConnected() ?? false,
      realtimeReady,
      ...audioInputLoop.getHealth(),
      audioOutputActive: outputActivity.isActive(),
      lastOutputAt,
      lastClearAt,
      lastOutputBytes: outputActivity.snapshot().sinkAudioBytes,
      ...getGoogleMeetRealtimeTranscriptHealth(transcript),
      ...getGoogleMeetRealtimeEventHealth(realtimeEvents),
      recentTalkEvents: summarizeGoogleMeetTalkEvents(recentTalkEvents),
      clearCount,
      bridgeClosed: stopped,
    }),
    stop,
  };
}
//#endregion
//#region extensions/google-meet/src/transports/types.ts
const GOOGLE_MEET_TRANSCRIPT_MAX_LINES = 2e3;
//#endregion
//#region extensions/google-meet/src/transports/chrome.ts
const chromeTransportDeps = { callGatewayFromCli };
const GOOGLE_MEET_CAPTION_SETTLE_MS = 1e3;
function isGoogleMeetTalkBackMode$2(mode) {
  return mode === "agent" || mode === "bidi";
}
function readMeetAuthUser(url) {
  if (!url) return;
  try {
    return new URL(url).searchParams.get("authuser") ?? void 0;
  } catch {
    return;
  }
}
async function assertBlackHole2chAvailable(params) {
  if (process.platform !== "darwin")
    throw new Error("Chrome Meet transport with blackhole-2ch audio is currently macOS-only");
  const result = await params.runtime.system.runCommandWithTimeout(
    [GOOGLE_MEET_SYSTEM_PROFILER_COMMAND, "SPAudioDataType"],
    { timeoutMs: params.timeoutMs },
  );
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (result.code !== 0 || !outputMentionsBlackHole2ch(output)) {
    const hint =
      params.runtime.system.formatNativeDependencyHint?.({
        packageName: "BlackHole 2ch",
        downloadCommand: "brew install blackhole-2ch",
      }) ?? "";
    throw new Error(
      [
        "BlackHole 2ch audio device not found.",
        "Install BlackHole 2ch and route Chrome input/output through the OpenClaw audio bridge.",
        hint,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
}
async function launchChromeMeet(params) {
  const checkRealtimeAudioPrerequisites = async () => {
    if (!isGoogleMeetTalkBackMode$2(params.mode)) return;
    await assertBlackHole2chAvailable({
      runtime: params.runtime,
      timeoutMs: Math.min(params.config.chrome.joinTimeoutMs, 1e4),
    });
    if (params.config.chrome.audioBridgeHealthCommand) {
      const health = await params.runtime.system.runCommandWithTimeout(
        params.config.chrome.audioBridgeHealthCommand,
        { timeoutMs: params.config.chrome.joinTimeoutMs },
      );
      if (health.code !== 0)
        throw new Error(
          `Chrome audio bridge health check failed: ${health.stderr || health.stdout || health.code}`,
        );
    }
  };
  const startRealtimeAudioBridge = async () => {
    if (!isGoogleMeetTalkBackMode$2(params.mode)) return;
    if (params.config.chrome.audioBridgeCommand) {
      if (params.mode === "agent")
        throw new Error(
          "Chrome agent mode requires chrome.audioInputCommand and chrome.audioOutputCommand so OpenClaw can run STT and regular TTS directly.",
        );
      const bridge = await params.runtime.system.runCommandWithTimeout(
        params.config.chrome.audioBridgeCommand,
        { timeoutMs: params.config.chrome.joinTimeoutMs },
      );
      if (bridge.code !== 0)
        throw new Error(
          `failed to start Chrome audio bridge: ${bridge.stderr || bridge.stdout || bridge.code}`,
        );
      return { type: "external-command" };
    }
    if (!params.config.chrome.audioInputCommand || !params.config.chrome.audioOutputCommand)
      throw new Error(
        "Chrome talk-back mode requires chrome.audioInputCommand and chrome.audioOutputCommand, or chrome.audioBridgeCommand for an external bridge.",
      );
    return {
      type: "command-pair",
      ...(params.mode === "agent"
        ? await startCommandAgentAudioBridge({
            config: params.config,
            fullConfig: params.fullConfig,
            runtime: params.runtime,
            meetingSessionId: params.meetingSessionId,
            requesterSessionKey: params.requesterSessionKey,
            inputCommand: params.config.chrome.audioInputCommand,
            outputCommand: params.config.chrome.audioOutputCommand,
            logger: params.logger,
          })
        : await startCommandRealtimeAudioBridge({
            config: {
              ...params.config,
              realtime: {
                ...params.config.realtime,
                strategy: "bidi",
              },
            },
            fullConfig: params.fullConfig,
            runtime: params.runtime,
            meetingSessionId: params.meetingSessionId,
            requesterSessionKey: params.requesterSessionKey,
            inputCommand: params.config.chrome.audioInputCommand,
            outputCommand: params.config.chrome.audioOutputCommand,
            logger: params.logger,
          })),
    };
  };
  await checkRealtimeAudioPrerequisites();
  if (!params.config.chrome.launch)
    return {
      launched: false,
      audioBridge: await startRealtimeAudioBridge(),
    };
  const result = await openMeetWithBrowserRequest({
    callBrowser: await resolveLocalBrowserRequest(params.runtime),
    config: params.config,
    mode: params.mode,
    meetingSessionId: params.meetingSessionId,
    url: params.url,
  });
  const audioBridge =
    isGoogleMeetTalkBackMode$2(params.mode) &&
    result.browser?.inCall === true &&
    result.browser.micMuted !== true &&
    result.browser.manualActionRequired !== true
      ? await startRealtimeAudioBridge()
      : void 0;
  return {
    ...result,
    audioBridge,
  };
}
function parseNodeStartResult(raw) {
  const value = raw && typeof raw === "object" && "payload" in raw ? raw.payload : raw;
  if (!value || typeof value !== "object")
    throw new Error("Google Meet node returned an invalid start result.");
  return value;
}
function parseMeetBrowserStatus(result) {
  const raw = (result && typeof result === "object" ? result : {}).result;
  if (typeof raw !== "string" || !raw.trim()) return;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Google Meet browser status JSON is malformed.");
  }
  return {
    inCall: parsed.inCall,
    micMuted: parsed.micMuted,
    lobbyWaiting: parsed.lobbyWaiting,
    leaveReason: parsed.leaveReason,
    captioning: parsed.captioning,
    captionsEnabledAttempted: parsed.captionsEnabledAttempted,
    transcriptLines: parsed.transcriptLines,
    lastCaptionAt: parsed.lastCaptionAt,
    lastCaptionSpeaker: parsed.lastCaptionSpeaker,
    lastCaptionText: parsed.lastCaptionText,
    recentTranscript: parsed.recentTranscript,
    audioOutputRouted: parsed.audioOutputRouted,
    audioOutputDeviceLabel: parsed.audioOutputDeviceLabel,
    audioOutputRouteError: parsed.audioOutputRouteError,
    manualActionRequired: parsed.manualActionRequired,
    manualActionReason: parsed.manualActionReason,
    manualActionMessage: parsed.manualActionMessage,
    browserUrl: parsed.url,
    browserTitle: parsed.title,
    status: "browser-control",
    notes: Array.isArray(parsed.notes)
      ? parsed.notes.filter((note) => typeof note === "string")
      : void 0,
  };
}
async function callLocalBrowserRequest(params) {
  return await chromeTransportDeps.callGatewayFromCli(
    "browser.request",
    {
      json: true,
      timeout: String(resolveBrowserGatewayTimeoutMs(params.timeoutMs)),
    },
    {
      method: params.method,
      path: params.path,
      body: params.body,
      timeoutMs: params.timeoutMs,
    },
    { progress: false },
  );
}
async function resolveLocalBrowserRequest(runtime) {
  if (!(await runtime.gateway.isAvailable())) return callLocalBrowserRequest;
  return async (params) =>
    await runtime.gateway.request(
      "browser.request",
      {
        method: params.method,
        path: params.path,
        body: params.body,
        timeoutMs: params.timeoutMs,
      },
      {
        timeoutMs: resolveBrowserGatewayTimeoutMs(params.timeoutMs),
        scopes: ["operator.admin"],
      },
    );
}
function resolveBrowserGatewayTimeoutMs(timeoutMs) {
  return addTimerTimeoutGraceMs(timeoutMs) ?? 1;
}
function mergeBrowserNotes(browser, notes) {
  if (!browser || notes.length === 0) return browser;
  return {
    ...browser,
    notes: uniqueStrings([...(browser.notes ?? []), ...notes]),
  };
}
function parsePermissionGrantNotes(result) {
  const record = result && typeof result === "object" ? result : {};
  const unsupportedPermissions = Array.isArray(record.unsupportedPermissions)
    ? record.unsupportedPermissions.filter((value) => typeof value === "string")
    : [];
  const notes = ["Granted Meet microphone/camera permissions through browser control."];
  if (unsupportedPermissions.includes("speakerSelection"))
    notes.push("Chrome did not accept the optional Meet speaker-selection permission.");
  return notes;
}
async function grantMeetMediaPermissions(params) {
  if (!params.allowMicrophone)
    return ["Observe-only mode skips Meet microphone/camera permission grants."];
  try {
    return parsePermissionGrantNotes(
      await params.callBrowser({
        method: "POST",
        path: "/permissions/grant",
        body: {
          origin: "https://meet.google.com",
          permissions: ["audioCapture", "videoCapture"],
          optionalPermissions: ["speakerSelection"],
          targetId: params.targetId,
          timeoutMs: Math.min(params.timeoutMs, 5e3),
        },
        timeoutMs: Math.min(params.timeoutMs, 5e3),
      }),
    );
  } catch (error) {
    return [
      `Could not grant Meet media permissions automatically: ${error instanceof Error ? error.message : String(error)}`,
    ];
  }
}
function meetStatusScript(params) {
  return `async () => {
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  const allowMicrophone = ${JSON.stringify(params.allowMicrophone)};
  const captionSessionId = ${JSON.stringify(params.captionSessionId)};
  const captureCaptions = ${JSON.stringify(params.captureCaptions)};
  const readOnly = ${JSON.stringify(Boolean(params.readOnly))};
  const buttons = [...document.querySelectorAll('button')];
  const buttonLabel = (button) =>
    [
      button.getAttribute("aria-label"),
      button.getAttribute("data-tooltip"),
      text(button),
    ]
      .filter(Boolean)
      .join(" ");
  const buttonLabels = buttons.map(buttonLabel).filter(Boolean);
  const notes = [];
  let audioOutputRouted;
  let audioOutputDeviceLabel;
  let audioOutputRouteError;
  const findButton = (pattern) =>
    buttons.find((button) => {
      const label = buttonLabel(button);
      return pattern.test(label) && !button.disabled;
    });
  const findCallControlButton = (pattern) =>
    buttons.find((button) => {
      const label = buttonLabel(button);
      return pattern.test(label) && !/remotely mute|someone else/i.test(label) && !button.disabled;
    });
  const input = [...document.querySelectorAll('input')].find((el) =>
    /your name/i.test(el.getAttribute('aria-label') || el.placeholder || '')
  );
  if (!readOnly && ${JSON.stringify(params.autoJoin)} && input && !input.value) {
    input.focus();
    input.value = ${JSON.stringify(params.guestName)};
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  const pageText = text(document.body).toLowerCase();
  const permissionText = [pageText, ...buttonLabels].join("\\n");
  const host = location.hostname.toLowerCase();
  const pageUrl = location.href;
  const permissionNeeded = /permission needed|microphone problem|speaker problem|allow.*(microphone|camera)|blocked.*(microphone|camera)|permission.*(microphone|camera|speaker)/i.test(permissionText);
  let mic = findCallControlButton(/^\\s*turn (?:off|on) microphone\\b/i);
  if (!mic) {
    const callControls = document.querySelector('[role="region"][aria-label="Call controls"]');
    mic = [...(callControls?.querySelectorAll('button') || [])].find((button) =>
      /^\\s*turn (?:off|on) microphone\\b/i.test(buttonLabel(button))
    );
  }
  if (!readOnly && allowMicrophone && mic && /turn on microphone/i.test(buttonLabel(mic))) {
    mic.click();
    notes.push("Attempted to turn on the Meet microphone for talk-back mode.");
  }
  if (!readOnly && !allowMicrophone && mic && /turn off microphone/i.test(mic.getAttribute('aria-label') || text(mic))) {
    mic.click();
    notes.push("Muted Meet microphone for observe-only mode.");
  }
  const joinElsewhere = findButton(/join here too/i);
  const join = !readOnly && ${JSON.stringify(params.autoJoin)}
    ? findButton(/join now|ask to join/i)
    : null;
  if (join) join.click();
  const microphoneChoice = findButton(/\\buse microphone\\b/i);
  const noMicrophoneChoice = findButton(/\\b(continue|join|use) without (microphone|mic)\\b|\\bnot now\\b/i);
  if (!readOnly && allowMicrophone && microphoneChoice) {
    microphoneChoice.click();
    notes.push("Accepted Meet microphone prompt with browser automation.");
  } else if (!readOnly && !allowMicrophone && noMicrophoneChoice) {
    noMicrophoneChoice.click();
    notes.push("Skipped Meet microphone prompt for observe-only mode.");
  }
  const inCall = buttons.some((button) => /leave call/i.test(button.getAttribute('aria-label') || text(button)));
  const routeMeetAudioOutput = async () => {
    if (
      !allowMicrophone ||
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.enumerateDevices
    ) return;
    const mediaElements = [...document.querySelectorAll('audio, video')]
      .filter((el) => typeof el.setSinkId === 'function');
    if (mediaElements.length === 0) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const output = devices.find((device) =>
        device.kind === 'audiooutput' && /\\bBlackHole\\s+2ch\\b/i.test(device.label || '')
      ) || devices.find((device) =>
        device.kind === 'audiooutput' && /\\bBlackHole\\b/i.test(device.label || '')
      );
      if (!output?.deviceId) {
        if (devices.some((device) => device.kind === 'audiooutput')) {
          notes.push("BlackHole 2ch speaker output was not visible to Meet.");
        }
        return;
      }
      let routed = 0;
      for (const element of mediaElements) {
        if (element.sinkId !== output.deviceId) {
          if (readOnly) {
            continue;
          }
          await element.setSinkId(output.deviceId);
          routed += 1;
        }
      }
      audioOutputRouted = mediaElements.some((element) => element.sinkId === output.deviceId);
      audioOutputDeviceLabel = output.label || "BlackHole 2ch";
      if (!readOnly && audioOutputRouted) {
        notes.push(
          routed > 0
            ? \`Routed Meet media output to \${audioOutputDeviceLabel}.\`
            : \`Meet media output already routed to \${audioOutputDeviceLabel}.\`
        );
      }
    } catch (error) {
      audioOutputRouteError = error?.message || String(error);
      notes.push(\`Could not route Meet speaker output to BlackHole 2ch: \${audioOutputRouteError}\`);
    }
  };
  if (inCall) {
    await routeMeetAudioOutput();
  }
  let captioning = false;
  let captionsEnabledAttempted = false;
  let transcriptLines = 0;
  let lastCaptionAt;
  let lastCaptionSpeaker;
  let lastCaptionText;
  let recentTranscript = [];
  const captionSelector = '[role="region"][aria-label*="aption" i], [aria-live="polite"][role="region"], div[aria-live="polite"]';
  const captionState = (() => {
    if (!captureCaptions) return undefined;
    const w = window;
    if (!inCall && !w.__openclawMeetCaptions) return undefined;
    // A reused tab starts a fresh logical transcript for each OpenClaw session.
    // Status refreshes omit the id, so they preserve the active page-owned buffer.
    if (!w.__openclawMeetCaptions || (captionSessionId && w.__openclawMeetCaptions.sessionId !== captionSessionId)) {
      if (w.__openclawMeetCaptions?.settleTimer !== undefined) {
        clearTimeout(w.__openclawMeetCaptions.settleTimer);
      }
      w.__openclawMeetCaptions?.observer?.disconnect?.();
      w.__openclawMeetCaptions = {
        sessionId: captionSessionId,
        // Epochs cross document lifetimes in the runtime transcript cursor.
        // Strong UUIDs keep a reloaded page distinct from its prior buffer.
        epoch: crypto.randomUUID(),
        enabledAttempted: false,
        observerInstalled: false,
        observer: undefined,
        droppedLines: 0,
        lines: [],
        settleTimer: undefined,
        visible: []
      };
    }
    return w.__openclawMeetCaptions;
  })();
  const normalizeCaption = (speaker, captionText) => {
    if (!captionState) return;
    const clean = String(captionText || "").replace(/\\s+/g, " ").trim();
    const cleanSpeaker = String(speaker || "").replace(/\\s+/g, " ").trim();
    if (!clean || clean.length < 2) return undefined;
    if (/^(turn on captions|turn off captions|captions)$/i.test(clean)) return undefined;
    return { speaker: cleanSpeaker || undefined, text: clean };
  };
  const commitLines = (state, entries) => {
    state.lines.push(...entries.map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text
    })));
    const excess = state.lines.length - ${GOOGLE_MEET_TRANSCRIPT_MAX_LINES};
    if (excess > 0) {
      state.lines.splice(0, excess);
      state.droppedLines = (state.droppedLines || 0) + excess;
    }
  };
  const scrapeCaptions = () => {
    if (!captionState) return;
    const regions = [...document.querySelectorAll(captionSelector)];
    const rows = [];
    for (const region of regions) {
      const raw = text(region);
      if (!raw) continue;
      const pieces = raw.split(/\\n+/).map((part) => part.trim()).filter(Boolean);
      const row = pieces.length >= 2
        ? normalizeCaption(pieces[0], pieces.slice(1).join(" "))
        : normalizeCaption("", pieces[0] || raw);
      if (row) rows.push({ ...row, node: region });
    }
    if (rows.length === 0) {
      // Meet briefly removes caption rows while rerendering. Keep them mutable
      // for one settle window so a DOM gap cannot fabricate a repeated line.
      if (captionState.visible.length > 0 && captionState.settleTimer === undefined) {
        const pendingState = captionState;
        pendingState.settleTimer = setTimeout(() => {
          if (window.__openclawMeetCaptions !== pendingState) return;
          commitLines(pendingState, pendingState.visible);
          pendingState.visible = [];
          pendingState.settleTimer = undefined;
        }, ${GOOGLE_MEET_CAPTION_SETTLE_MS});
      }
      return;
    }
    if (captionState.settleTimer !== undefined) {
      clearTimeout(captionState.settleTimer);
      captionState.settleTimer = undefined;
    }
    const previous = Array.isArray(captionState.visible) ? captionState.visible : [];
    const unmatchedPrevious = [...previous];
    const nextVisible = [];
    const now = Date.now();
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const priorIndex = unmatchedPrevious.findIndex((candidate) => {
        const sameTextLifecycle =
          candidate.text === row.text ||
          row.text.startsWith(candidate.text) ||
          candidate.text.startsWith(row.text);
        const sameDomLifecycle =
          candidate.node === row.node || now - candidate.seenAt <= ${GOOGLE_MEET_CAPTION_SETTLE_MS};
        return candidate.speaker === row.speaker && sameTextLifecycle && sameDomLifecycle;
      });
      const prior = priorIndex >= 0 ? unmatchedPrevious.splice(priorIndex, 1)[0] : undefined;
      const sameSpeaker = Boolean(prior) && prior.speaker === row.speaker;
      if (sameSpeaker && prior.text === row.text) {
        prior.node = row.node;
        prior.seenAt = now;
        nextVisible.push(prior);
        continue;
      }
      if (sameSpeaker && row.text.startsWith(prior.text)) {
        prior.text = row.text;
        prior.node = row.node;
        prior.seenAt = now;
        nextVisible.push(prior);
        continue;
      }
      if (sameSpeaker && prior.text.startsWith(row.text)) {
        prior.node = row.node;
        prior.seenAt = now;
        nextVisible.push(prior);
        continue;
      }
      const entry = {
        at: new Date().toISOString(),
        node: row.node,
        seenAt: now,
        speaker: row.speaker,
        text: row.text
      };
      nextVisible.push(entry);
    }
    commitLines(captionState, unmatchedPrevious);
    captionState.visible = nextVisible;
  };
  if (captionState) {
    if (!readOnly && inCall && !captionState.enabledAttempted) {
      const captionButton = findButton(/turn on captions|show captions|captions/i);
      const captionLabel = captionButton ? (captionButton.getAttribute("aria-label") || captionButton.getAttribute("data-tooltip") || text(captionButton)) : "";
      if (captionButton) {
        captionState.enabledAttempted = true;
        captionsEnabledAttempted = true;
        if (!/turn off captions|hide captions/i.test(captionLabel)) {
          captionButton.click();
          notes.push("Attempted to enable Meet captions for observe-only transcript health.");
        }
      }
    } else if (captionState.enabledAttempted) {
      captionsEnabledAttempted = true;
    }
    if (inCall && !captionState.observerInstalled) {
      captionState.observerInstalled = true;
      captionState.observer = new MutationObserver(scrapeCaptions);
      captionState.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
      notes.push("Installed Meet caption observer for observe-only transcript health.");
    }
    if (inCall) {
      scrapeCaptions();
    }
    const committedLines = Array.isArray(captionState.lines) ? captionState.lines : [];
    const visibleLines = Array.isArray(captionState.visible) ? captionState.visible : [];
    const lines = [...committedLines, ...visibleLines];
    const last = lines[lines.length - 1];
    captioning = document.querySelector(captionSelector) !== null || lines.length > 0;
    transcriptLines = (captionState.droppedLines || 0) + lines.length;
    lastCaptionAt = last?.at;
    lastCaptionSpeaker = last?.speaker;
    lastCaptionText = last?.text;
    recentTranscript = lines.slice(-5);
  }
  const lobbyWaiting = !inCall && /asking to be let in|you.?ll join when someone lets you in|waiting to be let in|ask to join/i.test(pageText);
  const leaveReason = !inCall && /you left the meeting|you.?ve left the meeting|removed from the meeting|you were removed|call ended|meeting ended/i.test(pageText)
    ? pageText.match(/you left the meeting|you.?ve left the meeting|removed from the meeting|you were removed|call ended|meeting ended/i)?.[0]
    : undefined;
  let manualActionReason;
  let manualActionMessage;
  if (!inCall && (host === "accounts.google.com" || /use your google account|to continue to google meet|choose an account|sign in to (join|continue)/i.test(pageText))) {
    manualActionReason = "google-login-required";
    manualActionMessage = "Sign in to Google in the OpenClaw browser profile, then retry the Meet join.";
  } else if (!inCall && joinElsewhere) {
    manualActionReason = "meet-session-conflict";
    manualActionMessage = "Meet is already active in another tab or device. Leave that session or reuse an English-pinned tab before retrying.";
  } else if (!inCall && /asking to be let in|you.?ll join when someone lets you in|waiting to be let in|ask to join/i.test(pageText)) {
    manualActionReason = "meet-admission-required";
    manualActionMessage = "Admit the OpenClaw browser participant in Google Meet, then retry speech.";
  } else if (permissionNeeded) {
    manualActionReason = "meet-permission-required";
    manualActionMessage = allowMicrophone
      ? "Allow microphone/camera/speaker permissions for Meet in the OpenClaw browser profile, then retry."
      : "Join without microphone/camera permissions in the OpenClaw browser profile, then retry.";
  } else if (!inCall && (allowMicrophone ? !microphoneChoice : !noMicrophoneChoice) && /do you want people to hear you in the meeting/i.test(pageText)) {
    manualActionReason = "meet-audio-choice-required";
    manualActionMessage = allowMicrophone
      ? "Meet is showing the microphone choice. Click Use microphone in the OpenClaw browser profile, then retry."
      : "Meet is showing the microphone choice. Choose the no-microphone option in the OpenClaw browser profile, then retry.";
  }
  return JSON.stringify({
    clickedJoin: Boolean(join),
    clickedMicrophoneChoice: Boolean(allowMicrophone && microphoneChoice),
    inCall,
    micMuted: mic ? /turn on microphone/i.test(buttonLabel(mic)) : undefined,
    lobbyWaiting,
    leaveReason,
    captioning,
    captionsEnabledAttempted,
    transcriptLines,
    lastCaptionAt,
    lastCaptionSpeaker,
    lastCaptionText,
    recentTranscript,
    audioOutputRouted,
    audioOutputDeviceLabel,
    audioOutputRouteError,
    manualActionRequired: Boolean(manualActionReason),
    manualActionReason,
    manualActionMessage,
    title: document.title,
    url: pageUrl,
    notes
  });
}`;
}
function meetTranscriptScript(meetingUrl, meetingSessionId, finalize) {
  const expectedMeetingUrl = normalizeMeetUrlForReuse(meetingUrl);
  return `() => {
  const expectedMeetingUrl = ${JSON.stringify(expectedMeetingUrl)};
  const expectedSessionId = ${JSON.stringify(meetingSessionId)};
  let currentMeetingUrl;
  try {
    const currentUrl = new URL(location.href);
    currentMeetingUrl = currentUrl.origin + currentUrl.pathname.toLowerCase().replace(/\\/$/, "");
  } catch {
    return JSON.stringify({ urlMatched: false });
  }
  if (!expectedMeetingUrl || currentMeetingUrl !== expectedMeetingUrl) {
    return JSON.stringify({ urlMatched: false });
  }
  const state = window.__openclawMeetCaptions;
  if (state?.sessionId && state.sessionId !== expectedSessionId) {
    return JSON.stringify({ urlMatched: true, sessionMatched: false });
  }
  if (${JSON.stringify(finalize)} && Array.isArray(state?.visible) && state.visible.length > 0) {
    if (state.settleTimer !== undefined) clearTimeout(state.settleTimer);
    state.settleTimer = undefined;
    state.lines = Array.isArray(state.lines) ? state.lines : [];
    state.lines.push(...state.visible.map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text
    })));
    state.visible = [];
    const excess = state.lines.length - ${GOOGLE_MEET_TRANSCRIPT_MAX_LINES};
    if (excess > 0) {
      state.lines.splice(0, excess);
      state.droppedLines = (state.droppedLines || 0) + excess;
    }
  }
  const lines = Array.isArray(state?.lines) ? state.lines : [];
  return JSON.stringify({
    urlMatched: true,
    sessionMatched: true,
    epoch: typeof state?.epoch === "string" ? state.epoch : undefined,
    droppedLines: Number.isFinite(state?.droppedLines) ? Math.max(0, Math.trunc(state.droppedLines)) : 0,
    lines: lines.map((line) => ({
      at: typeof line?.at === "string" ? line.at : undefined,
      speaker: typeof line?.speaker === "string" ? line.speaker : undefined,
      text: typeof line?.text === "string" ? line.text : ""
    })).filter((line) => line.text)
  });
}`;
}
function parseMeetTranscriptSnapshot(result) {
  const raw = (result && typeof result === "object" ? result : {}).result;
  if (typeof raw !== "string" || !raw.trim())
    return {
      droppedLines: 0,
      lines: [],
    };
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Google Meet transcript JSON is malformed.");
  }
  if (!parsed || typeof parsed !== "object")
    throw new Error("Google Meet transcript payload is invalid.");
  const payload = parsed;
  const droppedLines =
    typeof payload.droppedLines === "number" && Number.isSafeInteger(payload.droppedLines)
      ? Math.max(0, payload.droppedLines)
      : 0;
  const lines = Array.isArray(payload.lines)
    ? payload.lines.flatMap((value) => {
        if (!value || typeof value !== "object") return [];
        const line = value;
        if (typeof line.text !== "string" || !line.text.trim()) return [];
        return [
          {
            ...(typeof line.at === "string" ? { at: line.at } : {}),
            ...(typeof line.speaker === "string" ? { speaker: line.speaker } : {}),
            text: line.text,
          },
        ];
      })
    : [];
  return {
    droppedLines,
    ...(typeof payload.epoch === "string" ? { epoch: payload.epoch } : {}),
    lines,
    ...(typeof payload.urlMatched === "boolean" ? { urlMatched: payload.urlMatched } : {}),
    ...(typeof payload.sessionMatched === "boolean"
      ? { sessionMatched: payload.sessionMatched }
      : {}),
  };
}
async function readMeetTranscriptWithBrowserRequest(params) {
  const snapshot = parseMeetTranscriptSnapshot(
    await params.callBrowser({
      method: "POST",
      path: "/act",
      body: {
        kind: "evaluate",
        targetId: params.tab.targetId,
        fn: meetTranscriptScript(params.meetingUrl, params.meetingSessionId, params.finalize),
      },
      timeoutMs: params.timeoutMs,
    }),
  );
  if (snapshot.urlMatched === false)
    throw new Error("The tracked Meet tab no longer shows this session's meeting URL.");
  if (snapshot.sessionMatched === false)
    throw new Error("The tracked Meet tab now belongs to another OpenClaw meeting session.");
  return {
    droppedLines: snapshot.droppedLines,
    ...(snapshot.epoch ? { epoch: snapshot.epoch } : {}),
    lines: snapshot.lines,
  };
}
function meetLeaveScript(meetingUrl) {
  const expectedMeetingUrl = normalizeMeetUrlForReuse(meetingUrl);
  return `() => {
  const expectedMeetingUrl = ${JSON.stringify(expectedMeetingUrl)};
  let currentMeetingUrl;
  try {
    const currentUrl = new URL(location.href);
    currentMeetingUrl = currentUrl.origin + currentUrl.pathname.toLowerCase().replace(/\\/$/, "");
  } catch {
    return JSON.stringify({ departed: false });
  }
  if (!expectedMeetingUrl || currentMeetingUrl !== expectedMeetingUrl) {
    return JSON.stringify({ departed: true, urlMatched: false });
  }
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  // Locale-independent fallback: Meet renders the leave control as a Material
  // Symbols icon whose ligature text is "call_end" in every UI language, so a
  // localized aria-label (e.g. "Anruf verlassen") still resolves to the button.
  const hasLeaveIcon = (button) => {
    const icon = button.querySelector ? button.querySelector("i") : null;
    return icon ? (icon.textContent || "").trim() === "call_end" : false;
  };
  const buttons = [...document.querySelectorAll('button')];
  const label = (button) => [
    button.getAttribute("aria-label"),
    button.getAttribute("data-tooltip"),
    text(button),
  ]
    .filter(Boolean)
    .join(" ");
  const postCall = buttons.some((button) => /\\b(rejoin|return to home screen)\\b/i.test(label(button)));
  if (postCall) {
    return JSON.stringify({ departed: true, urlMatched: true });
  }
  // Managed join tabs are reused only after the English-tab gate or opened
  // through the English-UI helper, so follow-up labels are pinned to English.
  const confirmation = buttons.find((button) => {
    return !button.disabled && /\\bleave meeting\\b/i.test(label(button));
  });
  if (confirmation) {
    confirmation.click();
    return JSON.stringify({ departed: false, leaveAction: "confirm", urlMatched: true });
  }
  const leave = buttons.find((button) => {
    if (button.disabled) return false;
    return /leave call/i.test(label(button)) || hasLeaveIcon(button);
  });
  if (leave) {
    leave.click();
    return JSON.stringify({ departed: false, leaveAction: "leave", urlMatched: true });
  }
  return JSON.stringify({ departed: false, urlMatched: true });
}`;
}
function parseMeetLeaveResult(result) {
  const raw = (result && typeof result === "object" ? result : {}).result;
  if (typeof raw !== "string" || !raw.trim()) return { departed: false };
  try {
    const parsed = JSON.parse(raw);
    const leaveAction =
      parsed.leaveAction === "leave" || parsed.leaveAction === "confirm"
        ? parsed.leaveAction
        : void 0;
    return {
      departed: parsed.departed === true,
      ...(leaveAction ? { leaveAction } : {}),
      ...(typeof parsed.urlMatched === "boolean" ? { urlMatched: parsed.urlMatched } : {}),
    };
  } catch {
    return { departed: false };
  }
}
async function leaveMeetInPage(params) {
  const deadline = Date.now() + params.timeoutMs;
  let clickedLeave = false;
  let clickedConfirmation = false;
  do {
    const step = parseMeetLeaveResult(
      await params.callBrowser({
        method: "POST",
        path: "/act",
        body: {
          kind: "evaluate",
          targetId: params.targetId,
          fn: meetLeaveScript(params.meetingUrl),
        },
        timeoutMs: params.timeoutMs,
      }),
    );
    clickedLeave ||= step.leaveAction === "leave";
    clickedConfirmation ||= step.leaveAction === "confirm";
    if (step.departed || step.urlMatched !== true)
      return {
        departed: step.departed,
        clickedLeave,
        clickedConfirmation,
        urlMatched: step.urlMatched,
      };
    if (!step.leaveAction && !clickedLeave)
      return {
        departed: false,
        clickedLeave,
        clickedConfirmation,
        urlMatched: true,
      };
    if (!step.leaveAction)
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
  } while (Date.now() < deadline);
  return {
    departed: false,
    clickedLeave,
    clickedConfirmation,
    urlMatched: true,
  };
}
async function leaveMeetWithBrowserRequest(params) {
  if (!params.config.chrome.launch)
    return {
      left: false,
      note: "Browser leave skipped because chrome.launch is disabled.",
    };
  const timeoutMs = Math.min(Math.max(1e3, params.config.chrome.joinTimeoutMs), 5e3);
  const { targetId, openedByPlugin } = params.tab;
  try {
    if (
      !asBrowserTabs(
        await params.callBrowser({
          method: "GET",
          path: "/tabs",
          timeoutMs,
        }),
      ).find((entry) => entry.targetId === targetId)
    )
      return {
        left: true,
        note: "Meet tab is already closed.",
      };
    let leaveResult;
    try {
      leaveResult = await leaveMeetInPage({
        callBrowser: params.callBrowser,
        meetingUrl: params.meetingUrl,
        targetId,
        timeoutMs,
      });
    } catch (error) {
      return {
        left: false,
        note: `Browser control could not verify the Meet tab before leaving: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
    if (leaveResult.urlMatched === false)
      return {
        left: true,
        note: "Meet tab moved away from this session; left its current page untouched.",
      };
    if (leaveResult.urlMatched !== true)
      return {
        left: false,
        note: "Browser control could not verify that the tracked tab still showed this meeting.",
      };
    const { clickedLeave, departed } = leaveResult;
    if (!openedByPlugin)
      return {
        left: departed,
        note: departed
          ? "Clicked Meet's Leave call button; kept the reused browser tab open."
          : clickedLeave
            ? "Clicked Meet's Leave call button, but could not verify departure; leave it manually."
            : "Could not find Meet's Leave call button in the reused browser tab; leave it manually.",
      };
    await params.callBrowser({
      method: "DELETE",
      path: `/tabs/${targetId}`,
      timeoutMs,
    });
    return {
      left: true,
      note: clickedLeave
        ? "Clicked Meet's Leave call button and closed the Meet tab."
        : "Closed the Meet tab to leave the meeting (Leave call button was not found).",
    };
  } catch (error) {
    return {
      left: false,
      note: `Browser control could not leave the Meet tab: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
async function leaveChromeMeet(params) {
  return await leaveMeetWithBrowserRequest({
    callBrowser: await resolveLocalBrowserRequest(params.runtime),
    config: params.config,
    meetingUrl: params.meetingUrl,
    tab: params.tab,
  });
}
async function readChromeMeetTranscript(params) {
  return await readMeetTranscriptWithBrowserRequest({
    callBrowser: await resolveLocalBrowserRequest(params.runtime),
    finalize: params.finalize === true,
    meetingUrl: params.meetingUrl,
    meetingSessionId: params.meetingSessionId,
    tab: params.tab,
    timeoutMs: Math.min(Math.max(1e3, params.config.chrome.joinTimeoutMs), 1e4),
  });
}
async function readChromeMeetTranscriptOnNode(params) {
  const nodeId =
    params.nodeId ??
    (await resolveChromeNode({
      runtime: params.runtime,
      requestedNode: params.config.chromeNode.node,
    }));
  const timeoutMs = Math.min(Math.max(1e3, params.config.chrome.joinTimeoutMs), 1e4);
  return await readMeetTranscriptWithBrowserRequest({
    callBrowser: async (request) =>
      await callBrowserProxyOnNode({
        runtime: params.runtime,
        nodeId,
        method: request.method,
        path: request.path,
        body: request.body,
        timeoutMs: request.timeoutMs,
      }),
    finalize: params.finalize === true,
    meetingUrl: params.meetingUrl,
    meetingSessionId: params.meetingSessionId,
    tab: params.tab,
    timeoutMs,
  });
}
async function leaveChromeMeetOnNode(params) {
  const nodeId =
    params.nodeId ??
    (await resolveChromeNode({
      runtime: params.runtime,
      requestedNode: params.config.chromeNode.node,
    }));
  return await leaveMeetWithBrowserRequest({
    callBrowser: async (request) =>
      await callBrowserProxyOnNode({
        runtime: params.runtime,
        nodeId,
        method: request.method,
        path: request.path,
        body: request.body,
        timeoutMs: request.timeoutMs,
      }),
    config: params.config,
    meetingUrl: params.meetingUrl,
    tab: params.tab,
  });
}
async function openMeetWithBrowserProxy(params) {
  return await openMeetWithBrowserRequest({
    callBrowser: async (request) =>
      await callBrowserProxyOnNode({
        runtime: params.runtime,
        nodeId: params.nodeId,
        method: request.method,
        path: request.path,
        body: request.body,
        timeoutMs: request.timeoutMs,
      }),
    config: params.config,
    mode: params.mode,
    meetingSessionId: params.meetingSessionId,
    url: params.url,
  });
}
async function openMeetWithBrowserRequest(params) {
  if (!params.config.chrome.launch) return { launched: false };
  const timeoutMs = Math.max(1e3, params.config.chrome.joinTimeoutMs);
  let targetId;
  let tab;
  let openUrl = params.url;
  let openedByPlugin = false;
  if (params.config.chrome.reuseExistingTab) {
    const matchingTabs = asBrowserTabs(
      await params.callBrowser({
        method: "GET",
        path: "/tabs",
        timeoutMs: Math.min(timeoutMs, 5e3),
      }),
    ).filter((entry) => isSameMeetUrlForReuse(entry.url, params.url));
    const requestedAuthUser = readMeetAuthUser(params.url);
    tab = matchingTabs.find(
      (entry) =>
        isEnglishMeetTab(entry.url) &&
        (!requestedAuthUser || readMeetAuthUser(entry.url) === requestedAuthUser),
    );
    if (!tab) {
      if (!new URL(params.url).searchParams.has("authuser"))
        openUrl = matchingTabs.find((entry) => entry.url)?.url ?? params.url;
    }
    targetId = tab?.targetId;
    if (tab && targetId)
      await params.callBrowser({
        method: "POST",
        path: "/tabs/focus",
        body: { targetId },
        timeoutMs: Math.min(timeoutMs, 5e3),
      });
  }
  if (!targetId) {
    tab = readBrowserTab(
      await params.callBrowser({
        method: "POST",
        path: "/tabs/open",
        body: { url: forceMeetEnglishUi(openUrl) },
        timeoutMs,
      }),
    );
    targetId = tab?.targetId;
    openedByPlugin = Boolean(targetId);
  }
  if (!targetId)
    return {
      launched: true,
      browser: {
        status: "browser-control",
        notes: ["Browser proxy opened Meet but did not return a targetId."],
        browserUrl: tab?.url,
        browserTitle: tab?.title,
      },
    };
  const tabIdentity = {
    targetId,
    openedByPlugin,
  };
  const permissionNotes = await grantMeetMediaPermissions({
    allowMicrophone: isGoogleMeetTalkBackMode$2(params.mode),
    callBrowser: params.callBrowser,
    targetId,
    timeoutMs,
  });
  const deadline = Date.now() + Math.max(0, params.config.chrome.waitForInCallMs);
  let browser = {
    status: "browser-control",
    browserUrl: tab?.url,
    browserTitle: tab?.title,
    notes: permissionNotes,
  };
  do {
    try {
      browser = mergeBrowserNotes(
        parseMeetBrowserStatus(
          await params.callBrowser({
            method: "POST",
            path: "/act",
            body: {
              kind: "evaluate",
              targetId,
              fn: meetStatusScript({
                allowMicrophone: isGoogleMeetTalkBackMode$2(params.mode),
                captionSessionId: params.meetingSessionId,
                captureCaptions: params.mode === "transcribe",
                guestName: params.config.chrome.guestName,
                autoJoin: params.config.chrome.autoJoin,
              }),
            },
            timeoutMs: Math.min(timeoutMs, 1e4),
          }),
        ) ?? browser,
        permissionNotes,
      );
      if (
        browser?.inCall === true &&
        (!isGoogleMeetTalkBackMode$2(params.mode) || browser.micMuted !== true)
      )
        return {
          launched: true,
          browser,
          tab: tabIdentity,
        };
      if (browser?.manualActionRequired === true)
        return {
          launched: true,
          browser,
          tab: tabIdentity,
        };
    } catch (error) {
      browser = {
        ...browser,
        inCall: false,
        manualActionRequired: true,
        manualActionReason: "browser-control-unavailable",
        manualActionMessage:
          "Open the OpenClaw browser profile, finish Google Meet login, admission, or permission prompts, then retry.",
        notes: [
          ...permissionNotes,
          `Browser control could not inspect or auto-join Meet: ${error instanceof Error ? error.message : String(error)}`,
        ],
      };
      break;
    }
    const remainingWaitMs = deadline - Date.now();
    if (remainingWaitMs > 0)
      await new Promise((resolve) => {
        setTimeout(resolve, Math.min(750, remainingWaitMs));
      });
  } while (Date.now() < deadline);
  return {
    launched: true,
    browser,
    tab: tabIdentity,
  };
}
function isRecoverableMeetTab(tab, url) {
  if (url) return isSameMeetUrlForReuse(tab.url, url);
  if (normalizeMeetUrlForReuse(tab.url)) return true;
  return (
    (tab.url ?? "").startsWith("https://accounts.google.com/") &&
    /sign in|google accounts|meet/i.test(tab.title ?? "")
  );
}
function findRecoverableMeetTab(tabs, url) {
  const candidates = tabs.filter((tab) => isRecoverableMeetTab(tab, url));
  if (!url) return candidates[0];
  const requestedAuthUser = readMeetAuthUser(url);
  const accountCandidates = requestedAuthUser
    ? candidates.filter((tab) => readMeetAuthUser(tab.url) === requestedAuthUser)
    : candidates;
  return accountCandidates.find((tab) => isEnglishMeetTab(tab.url)) ?? accountCandidates[0];
}
async function inspectRecoverableMeetTab(params) {
  const allowMicrophone = params.mode !== "transcribe";
  await params.callBrowser({
    method: "POST",
    path: "/tabs/focus",
    body: { targetId: params.targetId },
    timeoutMs: Math.min(params.timeoutMs, 5e3),
  });
  if (normalizeMeetUrlForReuse(params.tab.url) && !isEnglishMeetTab(params.tab.url)) {
    const manualActionMessage =
      "The existing Meet tab is not pinned to English. Open the meeting with ?hl=en, then retry recovery.";
    return {
      found: true,
      targetId: params.targetId,
      tab: params.tab,
      browser: {
        status: "browser-control",
        browserUrl: params.tab.url,
        browserTitle: params.tab.title,
        manualActionRequired: true,
        manualActionReason: "meet-locale-required",
        manualActionMessage,
      },
      message: manualActionMessage,
    };
  }
  const permissionNotes = params.readOnly
    ? []
    : await grantMeetMediaPermissions({
        allowMicrophone,
        callBrowser: params.callBrowser,
        targetId: params.targetId,
        timeoutMs: params.timeoutMs,
      });
  const browser = mergeBrowserNotes(
    parseMeetBrowserStatus(
      await params.callBrowser({
        method: "POST",
        path: "/act",
        body: {
          kind: "evaluate",
          targetId: params.targetId,
          fn: meetStatusScript({
            allowMicrophone,
            captureCaptions: params.mode === "transcribe",
            guestName: params.config.chrome.guestName,
            autoJoin: false,
            readOnly: params.readOnly,
          }),
        },
        timeoutMs: Math.min(params.timeoutMs, 1e4),
      }),
    ) ?? {
      status: "browser-control",
      browserUrl: params.tab.url,
      browserTitle: params.tab.title,
    },
    permissionNotes,
  );
  const manual = browser?.manualActionRequired
    ? browser.manualActionMessage || browser.manualActionReason
    : void 0;
  return {
    found: true,
    targetId: params.targetId,
    tab: params.tab,
    browser,
    message:
      manual ?? (browser?.inCall ? "Existing Meet tab is in-call." : "Existing Meet tab focused."),
  };
}
async function recoverCurrentMeetTab(params) {
  const timeoutMs = Math.max(1e3, params.config.chrome.joinTimeoutMs);
  const callBrowser = await resolveLocalBrowserRequest(params.runtime);
  const tab = findRecoverableMeetTab(
    asBrowserTabs(
      await callBrowser({
        method: "GET",
        path: "/tabs",
        timeoutMs: Math.min(timeoutMs, 5e3),
      }),
    ),
    params.url,
  );
  const targetId = tab?.targetId;
  if (!tab || !targetId)
    return {
      transport: "chrome",
      found: false,
      tab,
      message: params.url
        ? `No existing Meet tab matched ${params.url}.`
        : "No existing Meet tab found in local Chrome.",
    };
  return {
    transport: "chrome",
    ...(await inspectRecoverableMeetTab({
      callBrowser,
      config: params.config,
      mode: params.mode,
      readOnly: params.readOnly,
      timeoutMs,
      tab,
      targetId,
    })),
  };
}
async function recoverCurrentMeetTabOnNode(params) {
  const nodeId = await resolveChromeNode({
    runtime: params.runtime,
    requestedNode: params.config.chromeNode.node,
  });
  const timeoutMs = Math.max(1e3, params.config.chrome.joinTimeoutMs);
  const tab = findRecoverableMeetTab(
    asBrowserTabs(
      await callBrowserProxyOnNode({
        runtime: params.runtime,
        nodeId,
        method: "GET",
        path: "/tabs",
        timeoutMs: Math.min(timeoutMs, 5e3),
      }),
    ),
    params.url,
  );
  const targetId = tab?.targetId;
  if (!tab || !targetId)
    return {
      transport: "chrome-node",
      nodeId,
      found: false,
      tab,
      message: params.url
        ? `No existing Meet tab matched ${params.url}.`
        : "No existing Meet tab found on the selected Chrome node.",
    };
  return {
    transport: "chrome-node",
    nodeId,
    ...(await inspectRecoverableMeetTab({
      callBrowser: async (request) =>
        await callBrowserProxyOnNode({
          runtime: params.runtime,
          nodeId,
          method: request.method,
          path: request.path,
          body: request.body,
          timeoutMs: request.timeoutMs,
        }),
      config: params.config,
      mode: params.mode,
      readOnly: params.readOnly,
      timeoutMs,
      tab,
      targetId,
    })),
  };
}
async function launchChromeMeetOnNode(params) {
  const nodeId = await resolveChromeNode({
    runtime: params.runtime,
    requestedNode: params.config.chromeNode.node,
  });
  try {
    await params.runtime.nodes.invoke({
      nodeId,
      command: "googlemeet.chrome",
      params: {
        action: "stopByUrl",
        url: params.url,
        mode: params.mode,
      },
      timeoutMs: 5e3,
    });
  } catch (error) {
    params.logger.debug?.(
      `[google-meet] node bridge cleanup before join ignored: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const browserControl = await openMeetWithBrowserProxy({
    runtime: params.runtime,
    nodeId,
    config: params.config,
    mode: params.mode,
    meetingSessionId: params.meetingSessionId,
    url: params.url,
  });
  const result = parseNodeStartResult(
    await params.runtime.nodes.invoke({
      nodeId,
      command: "googlemeet.chrome",
      params: {
        action: "start",
        url: params.url,
        mode: params.mode,
        launch: false,
        browserProfile: params.config.chrome.browserProfile,
        joinTimeoutMs: params.config.chrome.joinTimeoutMs,
        audioInputCommand: params.config.chrome.audioInputCommand,
        audioOutputCommand: params.config.chrome.audioOutputCommand,
        audioBridgeCommand: params.config.chrome.audioBridgeCommand,
        audioBridgeHealthCommand: params.config.chrome.audioBridgeHealthCommand,
      },
      timeoutMs: addTimerTimeoutGraceMs(params.config.chrome.joinTimeoutMs) ?? 1,
    }),
  );
  if (result.audioBridge?.type === "node-command-pair") {
    if (!result.bridgeId) throw new Error("Google Meet node did not return an audio bridge id.");
    const bridge = await (
      params.mode === "agent" ? startNodeAgentAudioBridge : startNodeRealtimeAudioBridge
    )({
      config:
        params.mode === "agent"
          ? params.config
          : {
              ...params.config,
              realtime: {
                ...params.config.realtime,
                strategy: "bidi",
              },
            },
      fullConfig: params.fullConfig,
      runtime: params.runtime,
      meetingSessionId: params.meetingSessionId,
      requesterSessionKey: params.requesterSessionKey,
      nodeId,
      bridgeId: result.bridgeId,
      logger: params.logger,
    });
    return {
      nodeId,
      launched: browserControl.launched || result.launched === true,
      audioBridge: bridge,
      browser: browserControl.browser ?? result.browser,
      tab: browserControl.tab,
    };
  }
  if (result.audioBridge?.type === "external-command")
    return {
      nodeId,
      launched: browserControl.launched || result.launched === true,
      audioBridge: { type: "external-command" },
      browser: browserControl.browser ?? result.browser,
      tab: browserControl.tab,
    };
  return {
    nodeId,
    launched: browserControl.launched || result.launched === true,
    browser: browserControl.browser ?? result.browser,
    tab: browserControl.tab,
  };
}
//#endregion
//#region extensions/google-meet/src/transports/twilio.ts
const DTMF_PATTERN = /^[0-9*#wWpP,]+$/;
function normalizeDialInNumber(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return;
  const compact = normalized.replace(/[()\s.-]/g, "");
  if (!/^\+?[0-9]{5,20}$/.test(compact)) throw new Error("dialInNumber must be a phone number");
  return compact;
}
function normalizeDtmfSequence(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return;
  const compact = normalized.replace(/\s+/g, "");
  if (!DTMF_PATTERN.test(compact))
    throw new Error("dtmfSequence may only contain digits, *, #, comma, w, p");
  return compact;
}
function buildMeetDtmfSequence(params) {
  const explicit = normalizeDtmfSequence(params.dtmfSequence);
  if (explicit) return explicit;
  const pin = normalizeOptionalString(params.pin);
  if (!pin) return;
  const compactPin = pin.replace(/\s+/g, "");
  if (!/^[0-9]+#?$/.test(compactPin))
    throw new Error("pin may only contain digits and an optional trailing #");
  return compactPin.endsWith("#") ? compactPin : `${compactPin}#`;
}
function prefixDtmfWait(sequence, delayMs) {
  if (!sequence || delayMs <= 0) return sequence;
  const waitCount = Math.ceil(delayMs / 500);
  if (waitCount <= 0) return sequence;
  return `${"w".repeat(waitCount)}${sequence}`;
}
//#endregion
//#region extensions/google-meet/src/voice-call-gateway.ts
async function createConnectedGatewayClient(config) {
  let client;
  await new Promise((resolve, reject) => {
    const abortStart = new AbortController();
    const timer = setTimeout(() => {
      abortStart.abort();
      reject(/* @__PURE__ */ new Error("gateway connect timeout"));
    }, config.voiceCall.requestTimeoutMs);
    client = new GatewayClient({
      url: config.voiceCall.gatewayUrl,
      token: config.voiceCall.token,
      requestTimeoutMs: config.voiceCall.requestTimeoutMs,
      clientName: "cli",
      clientDisplayName: "Google Meet plugin",
      scopes: ["operator.write"],
      onHelloOk: () => {
        clearTimeout(timer);
        resolve();
      },
      onConnectError: (err) => {
        clearTimeout(timer);
        abortStart.abort();
        reject(err);
      },
    });
    startGatewayClientWhenEventLoopReady(client, {
      timeoutMs: config.voiceCall.requestTimeoutMs,
      signal: abortStart.signal,
    })
      .then((readiness) => {
        if (!readiness.ready && !readiness.aborted) {
          clearTimeout(timer);
          reject(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
        }
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err instanceof Error ? err : new Error(String(err)));
      });
  });
  return client;
}
function createVoiceCallGateway(params) {
  if (!params.config.voiceCall.gatewayUrl)
    return {
      trustedPluginIdentity: true,
      request: (method, requestParams) =>
        params.runtime.gateway.request(method, requestParams, {
          timeoutMs: params.config.voiceCall.requestTimeoutMs,
        }),
    };
  return {
    trustedPluginIdentity: false,
    async request(method, requestParams) {
      const client = await createConnectedGatewayClient(params.config);
      try {
        return await client.request(method, requestParams, {
          timeoutMs: params.config.voiceCall.requestTimeoutMs,
        });
      } finally {
        await client.stopAndWait({ timeoutMs: 1e3 });
      }
    },
  };
}
function isVoiceCallMissingError(error) {
  const message = formatErrorMessage$1(error).toLowerCase();
  return message.includes("call not found") || message.includes("call is not active");
}
async function joinMeetViaVoiceCallGateway(params) {
  if (params.agentId && params.agentId !== "main" && !params.gateway.trustedPluginIdentity)
    throw new Error(
      "Per-agent Voice Call routing requires the local Gateway runtime. Remove google-meet voiceCall.gatewayUrl or omit agent routing.",
    );
  params.logger?.info(
    `[google-meet] Delegating Twilio join to Voice Call (dtmf=${params.dtmfSequence ? "pre-connect" : "none"}, intro=${params.message ? "delayed" : "none"})`,
  );
  const start = await params.gateway.request("voicecall.start", {
    to: params.dialInNumber,
    mode: "conversation",
    ...(params.dtmfSequence ? { dtmfSequence: params.dtmfSequence } : {}),
    ...(params.requesterSessionKey ? { requesterSessionKey: params.requesterSessionKey } : {}),
    ...(params.agentId && params.gateway.trustedPluginIdentity ? { agentId: params.agentId } : {}),
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
  });
  if (!start.callId) throw new Error(start.error || "voicecall.start did not return callId");
  params.logger?.info(`[google-meet] Voice Call Twilio phone leg started: callId=${start.callId}`);
  const dtmfSent = Boolean(params.dtmfSequence);
  if (dtmfSent)
    params.logger?.info(
      `[google-meet] Meet DTMF queued before realtime connect: callId=${start.callId} digits=${params.dtmfSequence?.length ?? 0}`,
    );
  let introSent = false;
  if (params.message) {
    const delayMs = params.dtmfSequence ? params.config.voiceCall.postDtmfSpeechDelayMs : 0;
    if (delayMs > 0) {
      params.logger?.info(
        `[google-meet] Waiting ${delayMs}ms after Meet DTMF before speaking intro for callId=${start.callId}`,
      );
      await sleep(delayMs);
    }
    let spoken;
    try {
      spoken = await params.gateway.request("voicecall.speak", {
        callId: start.callId,
        allowTwimlFallback: false,
        message: params.message,
      });
    } catch (err) {
      params.logger?.warn?.(
        `[google-meet] Skipped intro speech because realtime bridge was not ready: ${formatErrorMessage$1(err)}`,
      );
      spoken = { success: false };
    }
    if (spoken.success === false)
      params.logger?.warn?.(
        `[google-meet] Skipped intro speech because realtime bridge was not ready: ${spoken.error || "voicecall.speak failed"}`,
      );
    else {
      introSent = true;
      params.logger?.info(
        `[google-meet] Intro speech requested after Meet dial sequence: callId=${start.callId}`,
      );
    }
  }
  return {
    callId: start.callId,
    dtmfSent,
    introSent,
  };
}
async function endMeetVoiceCallGatewayCall(params) {
  try {
    await params.gateway.request("voicecall.end", { callId: params.callId });
  } catch (err) {
    if (!isVoiceCallMissingError(err)) throw err;
  }
}
async function getMeetVoiceCallGatewayCall(params) {
  return await params.gateway.request("voicecall.status", { callId: params.callId });
}
async function speakMeetViaVoiceCallGateway(params) {
  const spoken = await params.gateway.request("voicecall.speak", {
    callId: params.callId,
    message: params.message,
  });
  if (spoken.success === false) throw new Error(spoken.error || "voicecall.speak failed");
}
//#endregion
//#region extensions/google-meet/src/runtime.ts
function nowIso() {
  return /* @__PURE__ */ new Date().toISOString();
}
function buildTwilioVoiceCallSessionKey(meetingSessionId) {
  return `voice:google-meet:${meetingSessionId}`;
}
function resolveTransport(input, config) {
  return input ?? config.defaultTransport;
}
function resolveMode(input, config) {
  return input === "realtime" ? "agent" : (input ?? config.defaultMode);
}
function resolveSessionAgentId(request, config) {
  return normalizeAgentId(request.agentId ?? config.realtime.agentId);
}
function withSessionAgentConfig(config, agentId) {
  return config.realtime.agentId === agentId
    ? config
    : {
        ...config,
        realtime: {
          ...config.realtime,
          agentId,
        },
      };
}
function isGoogleMeetTalkBackMode$1(mode) {
  return mode === "agent" || mode === "bidi";
}
function isBrowserTransport(transport) {
  return transport === "chrome" || transport === "chrome-node";
}
function isReusableMeetSession(session, params) {
  return (
    session.state === "active" &&
    isSameMeetUrlForReuse(session.url, params.url) &&
    session.transport === params.transport &&
    session.mode === params.mode &&
    session.agentId === params.agentId
  );
}
function hasRealtimeAudioOutputAdvanced(health, startOutputBytes) {
  return (health?.lastOutputBytes ?? 0) > startOutputBytes;
}
function transcriptCheckpoint(health) {
  return {
    lines: health?.transcriptLines ?? 0,
    lastCaptionAt: health?.lastCaptionAt,
    lastCaptionText: health?.lastCaptionText,
  };
}
function hasTranscriptAdvanced(health, start) {
  if ((health?.transcriptLines ?? 0) > start.lines) return true;
  if (health?.lastCaptionAt && health.lastCaptionAt !== start.lastCaptionAt) return true;
  return Boolean(health?.lastCaptionText && health.lastCaptionText !== start.lastCaptionText);
}
function resolveProbeTimeoutMs(input, fallback) {
  if (input === void 0) return Math.min(Math.max(fallback, 1), 12e4);
  if (!Number.isFinite(input) || input <= 0) throw new Error("timeoutMs must be a positive number");
  return Math.min(Math.trunc(input), 12e4);
}
function isManagedChromeBrowserSession(session) {
  return Boolean(
    (session.transport === "chrome" || session.transport === "chrome-node") &&
    session.chrome &&
    session.chrome.launched,
  );
}
function noteSession(session, note) {
  session.notes = [...session.notes.filter((item) => item !== note), note];
}
function evaluateSpeechReadiness(session) {
  if (!isGoogleMeetTalkBackMode$1(session.mode) || !session.chrome) return { ready: true };
  if (!isManagedChromeBrowserSession(session)) {
    if (session.chrome.audioBridge) return { ready: true };
    return {
      ready: false,
      reason: "audio-bridge-unavailable",
      message: "Realtime speech requires an active Chrome audio bridge.",
    };
  }
  const health = session.chrome.health;
  if (health?.manualActionRequired)
    return {
      ready: false,
      reason: health.manualActionReason ?? "browser-unverified",
      message:
        health.manualActionMessage ??
        "Resolve the Google Meet browser prompt before asking OpenClaw to speak.",
    };
  if (health?.inCall === true) {
    if (health.micMuted === true)
      return {
        ready: false,
        reason: "meet-microphone-muted",
        message: "Turn on the OpenClaw Google Meet microphone before asking OpenClaw to speak.",
      };
    if (session.chrome.audioBridge) return { ready: true };
    return {
      ready: false,
      reason: "audio-bridge-unavailable",
      message: "Realtime speech requires an active Chrome audio bridge.",
    };
  }
  if (health?.inCall === false)
    return {
      ready: false,
      reason: "not-in-call",
      message: "Google Meet has not reported that the browser participant is in the call.",
    };
  return {
    ready: false,
    reason: "browser-unverified",
    message: "Google Meet browser state has not been verified yet.",
  };
}
function collectChromeAudioCommands(config) {
  return uniqueStrings(
    (config.chrome.audioBridgeCommand
      ? [config.chrome.audioBridgeCommand[0]]
      : [
          config.chrome.audioInputCommand?.[0],
          config.chrome.audioOutputCommand?.[0],
          config.chrome.bargeInInputCommand?.[0],
        ]
    ).filter((value) => Boolean(value?.trim())),
  );
}
async function commandExists(runtime, command) {
  return (
    (
      await runtime.system.runCommandWithTimeout(
        ["/bin/sh", "-lc", 'command -v "$1" >/dev/null 2>&1', "sh", command],
        { timeoutMs: 5e3 },
      )
    ).code === 0
  );
}
var GoogleMeetRuntime = class {
  #sessions = /* @__PURE__ */ new Map();
  #sessionLeaves = /* @__PURE__ */ new Map();
  #browserMeetingLocks = /* @__PURE__ */ new Map();
  #createdBrowserTabs = /* @__PURE__ */ new Map();
  #sessionStops = /* @__PURE__ */ new Map();
  #sessionSpeakers = /* @__PURE__ */ new Map();
  #sessionHealth = /* @__PURE__ */ new Map();
  #transcripts = /* @__PURE__ */ new Map();
  #transcriptCaptures = /* @__PURE__ */ new Map();
  #transcriptFinalizing = /* @__PURE__ */ new Set();
  #retiredTranscripts = /* @__PURE__ */ new Set();
  #voiceCallGateway;
  constructor(params) {
    this.params = params;
    this.#voiceCallGateway = createVoiceCallGateway(params);
  }
  list() {
    this.#refreshHealth();
    return [...this.#sessions.values()].toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  async status(sessionId) {
    this.#refreshHealth(sessionId);
    if (!sessionId) {
      const sessions = [...this.#sessions.values()].toSorted((a, b) =>
        a.createdAt.localeCompare(b.createdAt),
      );
      await Promise.all(sessions.map((session) => this.#refreshStatusHealthForSession(session)));
      return {
        found: true,
        sessions,
      };
    }
    const session = this.#sessions.get(sessionId);
    if (session) await this.#refreshStatusHealthForSession(session);
    return session
      ? {
          found: true,
          session,
        }
      : { found: false };
  }
  async transcript(sessionId, options = {}) {
    const session = this.#sessions.get(sessionId);
    if (!session) return { found: false };
    if (session.mode !== "transcribe")
      throw new Error("transcript is only available for transcribe-mode sessions");
    const sinceIndex = options.sinceIndex ?? 0;
    if (!Number.isSafeInteger(sinceIndex) || sinceIndex < 0)
      throw new Error("sinceIndex must be a non-negative safe integer");
    if (session.state === "active" && !this.#transcriptFinalizing.has(session.id))
      await this.#captureTranscriptSnapshot(session);
    const snapshot = this.#transcripts.get(sessionId) ?? {
      droppedLines: 0,
      lines: [],
    };
    const startIndex = Math.max(sinceIndex, snapshot.droppedLines);
    return {
      found: true,
      sessionId,
      startIndex,
      nextIndex: snapshot.droppedLines + snapshot.lines.length,
      droppedLines: snapshot.droppedLines,
      ...(session.transcriptEvicted ? { evicted: true } : {}),
      lines: snapshot.lines.slice(startIndex - snapshot.droppedLines),
    };
  }
  async setupStatus(options = {}) {
    const transport = resolveTransport(options.transport, this.params.config);
    const mode = resolveMode(options.mode, this.params.config);
    const twilioDialInNumber =
      transport === "twilio" ? normalizeDialInNumber(options.dialInNumber) : void 0;
    const shouldCheckChromeNode =
      transport === "chrome-node" ||
      (!options.transport && Boolean(this.params.config.chromeNode.node));
    let status = getGoogleMeetSetupStatus(this.params.config, {
      fullConfig: this.params.fullConfig,
      mode,
      transport,
      twilioDialInNumber,
    });
    if (shouldCheckChromeNode)
      try {
        const node = await resolveChromeNodeInfo({
          runtime: this.params.runtime,
          requestedNode: this.params.config.chromeNode.node,
        });
        const label = node.displayName ?? node.remoteIp ?? node.nodeId ?? "connected node";
        status = addGoogleMeetSetupCheck(status, {
          id: "chrome-node-connected",
          ok: true,
          message: `Connected Google Meet node ready: ${label}`,
        });
      } catch (error) {
        status = addGoogleMeetSetupCheck(status, {
          id: "chrome-node-connected",
          ok: false,
          message: formatErrorMessage$1(error),
        });
      }
    if (transport === "chrome" && isGoogleMeetTalkBackMode$1(mode)) {
      try {
        await assertBlackHole2chAvailable({
          runtime: this.params.runtime,
          timeoutMs: Math.min(this.params.config.chrome.joinTimeoutMs, 1e4),
        });
        status = addGoogleMeetSetupCheck(status, {
          id: "chrome-local-audio-device",
          ok: true,
          message: "BlackHole 2ch audio device found",
        });
      } catch (error) {
        status = addGoogleMeetSetupCheck(status, {
          id: "chrome-local-audio-device",
          ok: false,
          message: formatErrorMessage$1(error),
        });
      }
      const commands = collectChromeAudioCommands(this.params.config);
      const missingCommands = [];
      for (const command of commands)
        try {
          if (!(await commandExists(this.params.runtime, command))) missingCommands.push(command);
        } catch {
          missingCommands.push(command);
        }
      status = addGoogleMeetSetupCheck(status, {
        id: "chrome-local-audio-commands",
        ok: commands.length > 0 && missingCommands.length === 0,
        message:
          commands.length === 0
            ? "Chrome talk-back audio commands are not configured"
            : missingCommands.length === 0
              ? `Chrome audio command${commands.length === 1 ? "" : "s"} available: ${commands.join(", ")}`
              : `Chrome audio command${missingCommands.length === 1 ? "" : "s"} missing: ${missingCommands.join(", ")}`,
      });
    }
    return status;
  }
  async createViaBrowser() {
    const result = await createMeetWithBrowserProxyOnNode({
      runtime: this.params.runtime,
      config: this.params.config,
    });
    if (result.openedByPlugin && result.targetId)
      this.#createdBrowserTabs.set(`${result.nodeId}:${result.targetId}`, result.meetingUri);
    return result;
  }
  async recoverCurrentTab(request = {}) {
    const transport = resolveTransport(request.transport, this.params.config);
    if (transport === "twilio")
      throw new Error("recover_current_tab only supports chrome or chrome-node transports");
    const url = request.url ? normalizeMeetUrl(request.url) : void 0;
    if (transport === "chrome-node")
      return recoverCurrentMeetTabOnNode({
        runtime: this.params.runtime,
        config: this.params.config,
        url,
      });
    return recoverCurrentMeetTab({
      runtime: this.params.runtime,
      config: this.params.config,
      url,
    });
  }
  async join(request) {
    const url = normalizeMeetUrl(request.url);
    const transport = resolveTransport(request.transport, this.params.config);
    const mode = resolveMode(request.mode, this.params.config);
    const agentId = resolveSessionAgentId(request, this.params.config);
    if (!isBrowserTransport(transport))
      return await this.#joinUnlocked(request, {
        url,
        transport,
        mode,
        agentId,
      });
    return await this.#withBrowserMeetingLock(
      transport,
      url,
      async () =>
        await this.#joinUnlocked(request, {
          url,
          transport,
          mode,
          agentId,
        }),
    );
  }
  async #joinUnlocked(request, resolved) {
    const { url, transport, mode, agentId } = resolved;
    const activeSessions = this.list().filter(
      (session) =>
        session.state === "active" &&
        isSameMeetUrlForReuse(session.url, url) &&
        session.transport === transport,
    );
    const retainedBrowserTabs = [];
    if (isBrowserTransport(transport) && isGoogleMeetTalkBackMode$1(mode))
      for (const session of activeSessions) {
        if (
          !isGoogleMeetTalkBackMode$1(session.mode) ||
          isReusableMeetSession(session, {
            url,
            transport,
            mode,
            agentId,
          })
        )
          continue;
        const tab = this.params.config.chrome.reuseExistingTab
          ? session.chrome?.browserTab
          : void 0;
        const keepBrowserParticipant = Boolean(tab) || session.chrome?.launched === false;
        if (tab)
          retainedBrowserTabs.push({
            session,
            tab,
          });
        try {
          if (
            (
              await this.#leaveUnlocked(
                session.id,
                keepBrowserParticipant ? { keepBrowserTab: true } : void 0,
              )
            ).browserLeft === false
          )
            throw new Error("Could not leave the previous Meet browser tab before reassignment.");
        } catch (error) {
          await this.#settleRetainedBrowserTabs(retainedBrowserTabs);
          throw error;
        }
        noteSession(session, "Ended before the same Meet tab was reassigned to another agent.");
      }
    let reusable = activeSessions.find((session) =>
      isReusableMeetSession(session, {
        url,
        transport,
        mode,
        agentId,
      }),
    );
    if (reusable?.transport === "twilio") {
      await this.#refreshTwilioVoiceCallStatus(reusable);
      if (reusable.state !== "active") reusable = void 0;
    }
    const speechInstructions = request.message ?? this.params.config.realtime.introMessage;
    if (reusable) {
      await this.#refreshBrowserHealthForChromeSession(reusable);
      noteSession(reusable, "Reused existing active Meet session.");
      reusable.updatedAt = nowIso();
      const spoken =
        isGoogleMeetTalkBackMode$1(mode) && speechInstructions
          ? await this.#speakWhenReady(reusable, speechInstructions)
          : false;
      return {
        session: reusable,
        spoken,
      };
    }
    const createdAt = nowIso();
    let delegatedTwilioSpoken = false;
    const session = {
      id: `meet_${randomUUID()}`,
      url,
      transport,
      mode,
      agentId,
      state: "active",
      createdAt,
      updatedAt: createdAt,
      participantIdentity:
        transport === "twilio"
          ? "Twilio phone participant"
          : transport === "chrome-node"
            ? "signed-in Google Chrome profile on a paired node"
            : "signed-in Google Chrome profile",
      realtime: {
        enabled: isGoogleMeetTalkBackMode$1(mode),
        strategy: mode === "bidi" ? "bidi" : "agent",
        provider:
          mode === "bidi"
            ? (this.params.config.realtime.voiceProvider ?? this.params.config.realtime.provider)
            : void 0,
        model: mode === "bidi" ? this.params.config.realtime.model : void 0,
        transcriptionProvider:
          mode === "agent"
            ? (this.params.config.realtime.transcriptionProvider ??
              this.params.config.realtime.provider)
            : void 0,
        toolPolicy: this.params.config.realtime.toolPolicy,
      },
      notes: [],
    };
    try {
      if (transport === "chrome" || transport === "chrome-node") {
        const chromeConfig = withSessionAgentConfig(this.params.config, agentId);
        let result;
        try {
          result =
            transport === "chrome-node"
              ? await launchChromeMeetOnNode({
                  runtime: this.params.runtime,
                  config: chromeConfig,
                  fullConfig: this.params.fullConfig,
                  meetingSessionId: session.id,
                  requesterSessionKey: request.requesterSessionKey,
                  mode,
                  url,
                  logger: this.params.logger,
                })
              : await launchChromeMeet({
                  runtime: this.params.runtime,
                  config: chromeConfig,
                  fullConfig: this.params.fullConfig,
                  meetingSessionId: session.id,
                  requesterSessionKey: request.requesterSessionKey,
                  mode,
                  url,
                  logger: this.params.logger,
                });
        } catch (error) {
          await this.#settleRetainedBrowserTabs(retainedBrowserTabs);
          throw error;
        }
        const resultNodeId = "nodeId" in result ? result.nodeId : void 0;
        const browserTab = this.#inheritBrowserTabOwnership({
          transport,
          nodeId: resultNodeId,
          meetingUrl: url,
          tab: result.tab,
        });
        session.chrome = {
          audioBackend: this.params.config.chrome.audioBackend,
          launched: result.launched,
          nodeId: resultNodeId,
          browserProfile: this.params.config.chrome.browserProfile,
          browserTab,
          health: "browser" in result ? result.browser : void 0,
        };
        this.#attachChromeAudioBridge(session, result.audioBridge);
        if (
          !(await this.#settleRetainedBrowserTabs(
            retainedBrowserTabs,
            browserTab
              ? {
                  transport,
                  nodeId: resultNodeId,
                  tab: browserTab,
                }
              : void 0,
          ))
        ) {
          try {
            await this.#leaveSession(session);
          } catch (error) {
            this.params.logger.warn(
              `[google-meet] replacement cleanup failed: ${formatErrorMessage$1(error)}`,
            );
          }
          throw new Error("Could not leave the previous Meet browser tab before reassignment.");
        }
        session.notes.push(
          result.audioBridge
            ? transport === "chrome-node"
              ? "Chrome node transport joins as the signed-in Google profile on the selected node and routes realtime audio through the node bridge."
              : "Chrome transport joins as the signed-in Google profile and routes realtime audio through the configured bridge."
            : isGoogleMeetTalkBackMode$1(mode)
              ? "Chrome transport joins as the signed-in Google profile and expects BlackHole 2ch audio routing."
              : "Chrome transport joins as the signed-in Google profile without starting the realtime audio bridge.",
        );
        this.#refreshSpeechReadiness(session);
      } else {
        const dialInNumber = normalizeDialInNumber(
          request.dialInNumber ?? this.params.config.twilio.defaultDialInNumber,
        );
        if (!dialInNumber)
          throw new Error(
            "Twilio transport requires a Meet dial-in phone number. Google Meet URLs do not include dial-in details; pass dialInNumber with optional pin/dtmfSequence, configure twilio.defaultDialInNumber, or use chrome/chrome-node transport.",
          );
        const rawDtmfSequence = buildMeetDtmfSequence({
          pin: request.pin ?? this.params.config.twilio.defaultPin,
          dtmfSequence: request.dtmfSequence ?? this.params.config.twilio.defaultDtmfSequence,
        });
        const dtmfSequence =
          request.dtmfSequence || this.params.config.twilio.defaultDtmfSequence
            ? rawDtmfSequence
            : prefixDtmfWait(rawDtmfSequence, this.params.config.voiceCall.dtmfDelayMs);
        const delegatedAgentId = Boolean(
          normalizeOptionalString(request.agentId) ||
          normalizeOptionalString(this.params.config.realtime.agentId),
        )
          ? agentId
          : void 0;
        const voiceCallResult = this.params.config.voiceCall.enabled
          ? await joinMeetViaVoiceCallGateway({
              config: this.params.config,
              gateway: this.#voiceCallGateway,
              dialInNumber,
              dtmfSequence,
              logger: this.params.logger,
              ...(request.requesterSessionKey
                ? { requesterSessionKey: request.requesterSessionKey }
                : {}),
              agentId: delegatedAgentId,
              sessionKey: delegatedAgentId
                ? `agent:${delegatedAgentId}:google-meet:${session.id}`
                : buildTwilioVoiceCallSessionKey(session.id),
              message: isGoogleMeetTalkBackMode$1(mode)
                ? (request.message ??
                  this.params.config.voiceCall.introMessage ??
                  this.params.config.realtime.introMessage)
                : void 0,
            })
          : void 0;
        delegatedTwilioSpoken = Boolean(voiceCallResult?.introSent);
        session.twilio = {
          dialInNumber,
          pinProvided: Boolean(request.pin ?? this.params.config.twilio.defaultPin),
          dtmfSequence,
          voiceCallId: voiceCallResult?.callId,
          dtmfSent: voiceCallResult?.dtmfSent,
          introSent: voiceCallResult?.introSent,
        };
        if (voiceCallResult?.callId)
          this.#sessionStops.set(session.id, async () => {
            await endMeetVoiceCallGatewayCall({
              gateway: this.#voiceCallGateway,
              callId: voiceCallResult.callId,
            });
          });
        session.notes.push(
          this.params.config.voiceCall.enabled
            ? dtmfSequence
              ? "Twilio transport delegated the phone leg to the voice-call plugin, then queued configured DTMF before realtime connect."
              : "Twilio transport delegated the call to the voice-call plugin without configured DTMF."
            : "Twilio transport is an explicit dial plan; voice-call delegation is disabled.",
        );
      }
    } catch (err) {
      this.params.logger.warn(`[google-meet] join failed: ${formatErrorMessage$1(err)}`);
      throw err;
    }
    this.#sessions.set(session.id, session);
    return {
      session,
      spoken:
        transport === "twilio"
          ? delegatedTwilioSpoken
          : isGoogleMeetTalkBackMode$1(mode) && speechInstructions
            ? await this.#speakWhenReady(session, speechInstructions)
            : false,
    };
  }
  async leave(sessionId, opts) {
    const session = this.#sessions.get(sessionId);
    if (!session) return { found: false };
    if (!isBrowserTransport(session.transport)) return await this.#leaveUnlocked(sessionId, opts);
    return await this.#withBrowserMeetingLock(
      session.transport,
      session.url,
      async () => await this.#leaveUnlocked(sessionId, opts),
    );
  }
  async #leaveUnlocked(sessionId, opts) {
    const inFlight = this.#sessionLeaves.get(sessionId);
    if (inFlight) return await inFlight;
    const session = this.#sessions.get(sessionId);
    if (!session) return { found: false };
    if (session.state === "ended")
      return {
        found: true,
        session,
        ...(session.browserLeft === void 0 ? {} : { browserLeft: session.browserLeft }),
      };
    const leave = this.#leaveSession(session, opts);
    this.#sessionLeaves.set(sessionId, leave);
    try {
      return await leave;
    } finally {
      if (this.#sessionLeaves.get(sessionId) === leave) this.#sessionLeaves.delete(sessionId);
    }
  }
  async #withBrowserMeetingLock(transport, url, operation) {
    const key = `${transport}:${normalizeMeetUrlForReuse(url) ?? url}`;
    const previous = this.#browserMeetingLocks.get(key) ?? Promise.resolve();
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const tail = previous.then(() => gate);
    this.#browserMeetingLocks.set(key, tail);
    await previous;
    try {
      return await operation();
    } finally {
      release?.();
      if (this.#browserMeetingLocks.get(key) === tail) this.#browserMeetingLocks.delete(key);
    }
  }
  async #leaveSession(session, opts) {
    if (session.mode === "transcribe") {
      this.#transcriptFinalizing.add(session.id);
      await this.#captureTranscriptSnapshot(session, { finalize: true }).catch((error) => {
        this.params.logger.debug?.(
          `[google-meet] final transcript snapshot ignored: ${formatErrorMessage$1(error)}`,
        );
      });
    }
    session.state = "ended";
    session.updatedAt = nowIso();
    const stop = this.#sessionStops.get(session.id);
    this.#sessionStops.delete(session.id);
    this.#sessionSpeakers.delete(session.id);
    this.#sessionHealth.delete(session.id);
    let browserLeft;
    try {
      await stop?.();
    } finally {
      try {
        if (!opts?.keepBrowserTab) browserLeft = await this.#releaseBrowserTab(session);
      } finally {
        this.#retireTranscript(session.id);
        this.#transcriptFinalizing.delete(session.id);
      }
    }
    return {
      found: true,
      session,
      ...(browserLeft === void 0 ? {} : { browserLeft }),
    };
  }
  async #captureTranscriptSnapshot(session, options = {}) {
    const capture = (this.#transcriptCaptures.get(session.id) ?? Promise.resolve())
      .catch(() => {})
      .then(async () => {
        if (!isBrowserTransport(session.transport) || session.mode !== "transcribe") return;
        const tab = session.chrome?.browserTab;
        if (!tab) return;
        const snapshot =
          session.transport === "chrome-node"
            ? await readChromeMeetTranscriptOnNode({
                runtime: this.params.runtime,
                nodeId: session.chrome?.nodeId,
                config: this.params.config,
                ...(options.finalize === void 0 ? {} : { finalize: options.finalize }),
                meetingUrl: session.url,
                meetingSessionId: session.id,
                tab,
              })
            : await readChromeMeetTranscript({
                runtime: this.params.runtime,
                config: this.params.config,
                ...(options.finalize === void 0 ? {} : { finalize: options.finalize }),
                meetingUrl: session.url,
                meetingSessionId: session.id,
                tab,
              });
        this.#mergeTranscriptSnapshot(session.id, snapshot);
      });
    this.#transcriptCaptures.set(session.id, capture);
    try {
      await capture;
    } finally {
      if (this.#transcriptCaptures.get(session.id) === capture)
        this.#transcriptCaptures.delete(session.id);
    }
  }
  #mergeTranscriptSnapshot(sessionId, snapshot) {
    const pageNextIndex = snapshot.droppedLines + snapshot.lines.length;
    const retained = this.#transcripts.get(sessionId);
    if (!retained) {
      this.#transcripts.set(sessionId, {
        droppedLines: snapshot.droppedLines,
        lines: snapshot.lines,
        pageEpoch: snapshot.epoch,
        pageNextIndex,
      });
      return;
    }
    if (retained.pageEpoch !== snapshot.epoch) {
      retained.droppedLines += snapshot.droppedLines;
      retained.lines.push(...snapshot.lines);
      retained.pageEpoch = snapshot.epoch;
      retained.pageNextIndex = pageNextIndex;
    } else if (pageNextIndex > retained.pageNextIndex) {
      const appendFrom = Math.max(retained.pageNextIndex, snapshot.droppedLines);
      retained.droppedLines += Math.max(0, snapshot.droppedLines - retained.pageNextIndex);
      retained.lines.push(...snapshot.lines.slice(appendFrom - snapshot.droppedLines));
      retained.pageNextIndex = pageNextIndex;
    }
    const excess = retained.lines.length - GOOGLE_MEET_TRANSCRIPT_MAX_LINES;
    if (excess > 0) {
      retained.lines.splice(0, excess);
      retained.droppedLines += excess;
    }
  }
  #retireTranscript(sessionId) {
    const snapshot = this.#transcripts.get(sessionId);
    if (snapshot) {
      this.#transcripts.delete(sessionId);
      this.#transcripts.set(sessionId, snapshot);
      this.#retiredTranscripts.delete(sessionId);
      this.#retiredTranscripts.add(sessionId);
    }
    const retainedIds = [...this.#retiredTranscripts]
      .filter((id) => this.#transcripts.has(id))
      .toSorted((a, b) =>
        (this.#sessions.get(a)?.updatedAt ?? "").localeCompare(
          this.#sessions.get(b)?.updatedAt ?? "",
        ),
      );
    for (const id of retainedIds.slice(0, -4)) {
      this.#transcripts.delete(id);
      this.#retiredTranscripts.delete(id);
      const session = this.#sessions.get(id);
      if (session) session.transcriptEvicted = true;
    }
  }
  #inheritBrowserTabOwnership(params) {
    if (!params.tab) return;
    const tab = params.tab;
    const createdTabKey =
      params.transport === "chrome-node" && params.nodeId
        ? `${params.nodeId}:${tab.targetId}`
        : void 0;
    const createdMeetingUrl = createdTabKey ? this.#createdBrowserTabs.get(createdTabKey) : void 0;
    const inheritedFromCreate = isSameMeetUrlForReuse(createdMeetingUrl, params.meetingUrl);
    if (createdMeetingUrl && createdTabKey) this.#createdBrowserTabs.delete(createdTabKey);
    const inheritedFromSession = [...this.#sessions.values()].some((session) => {
      const trackedTab = session.chrome?.browserTab;
      if (!trackedTab) return false;
      return (
        session.transport === params.transport &&
        isSameMeetUrlForReuse(session.url, params.meetingUrl) &&
        session.chrome?.nodeId === params.nodeId &&
        trackedTab.targetId === tab.targetId &&
        trackedTab.openedByPlugin
      );
    });
    return inheritedFromCreate || inheritedFromSession
      ? {
          ...tab,
          openedByPlugin: true,
        }
      : tab;
  }
  async #settleRetainedBrowserTabs(retained, adopted) {
    let settled = true;
    for (const { session, tab } of retained.splice(0)) {
      if (
        adopted?.transport === session.transport &&
        adopted.nodeId === session.chrome?.nodeId &&
        adopted.tab.targetId === tab.targetId
      ) {
        if (session.chrome) session.chrome.browserTab = void 0;
        continue;
      }
      if ((await this.#releaseBrowserTab(session)) === false) settled = false;
    }
    return settled;
  }
  async #releaseBrowserTab(session) {
    let browserLeft;
    try {
      browserLeft = await this.#leaveBrowserMeetTab(session);
    } catch (error) {
      noteSession(
        session,
        `Browser control could not leave the Meet tab: ${formatErrorMessage$1(error)}`,
      );
      browserLeft = false;
    }
    session.browserLeft = browserLeft;
    if (session.chrome && browserLeft !== false) session.chrome.browserTab = void 0;
    return browserLeft;
  }
  async #leaveBrowserMeetTab(session) {
    if (!isBrowserTransport(session.transport)) return;
    const tab = session.chrome?.browserTab;
    if (!tab) {
      noteSession(
        session,
        "No tracked Meet browser tab for this session; close the Meet tab manually if it is still in the call.",
      );
      return false;
    }
    if (
      this.list().some(
        (other) =>
          other.id !== session.id &&
          other.state === "active" &&
          isBrowserTransport(other.transport) &&
          other.chrome?.browserTab?.targetId === tab.targetId &&
          other.chrome?.nodeId === session.chrome?.nodeId,
      )
    ) {
      noteSession(session, "Kept the shared Meet tab open because another active session uses it.");
      return;
    }
    const result =
      session.transport === "chrome-node"
        ? await leaveChromeMeetOnNode({
            runtime: this.params.runtime,
            nodeId: session.chrome?.nodeId,
            config: this.params.config,
            meetingUrl: session.url,
            tab,
          })
        : await leaveChromeMeet({
            runtime: this.params.runtime,
            config: this.params.config,
            meetingUrl: session.url,
            tab,
          });
    noteSession(session, result.note);
    return result.left;
  }
  async speak(sessionId, instructions) {
    const session = this.#sessions.get(sessionId);
    if (!session)
      return {
        found: false,
        spoken: false,
      };
    if (session.transport === "twilio" && session.twilio?.voiceCallId) {
      try {
        await speakMeetViaVoiceCallGateway({
          gateway: this.#voiceCallGateway,
          callId: session.twilio.voiceCallId,
          message:
            instructions ||
            this.params.config.voiceCall.introMessage ||
            this.params.config.realtime.introMessage ||
            "",
        });
      } catch (err) {
        if (!isVoiceCallMissingError(err)) throw err;
        this.#markTwilioSessionEnded(session, "Voice Call is no longer active.");
        return {
          found: true,
          spoken: false,
          session,
        };
      }
      session.twilio.introSent = true;
      session.updatedAt = nowIso();
      return {
        found: true,
        spoken: true,
        session,
      };
    }
    await this.#refreshBrowserHealthForChromeSession(session);
    await this.#ensureChromeRealtimeBridge(session);
    const speak = this.#sessionSpeakers.get(sessionId);
    if (!speak || session.state !== "active")
      return {
        found: true,
        spoken: false,
        session,
      };
    const readiness = this.#refreshSpeechReadiness(session);
    if (!readiness.ready) {
      const note = readiness.message
        ? `Realtime speech blocked: ${readiness.message}`
        : "Realtime speech blocked until Google Meet is ready.";
      session.notes = [...session.notes.filter((item) => item !== note), note];
      session.updatedAt = nowIso();
      return {
        found: true,
        spoken: false,
        session,
      };
    }
    speak(instructions || this.params.config.realtime.introMessage);
    session.updatedAt = nowIso();
    this.#refreshHealth(sessionId);
    return {
      found: true,
      spoken: true,
      session,
    };
  }
  async #speakWhenReady(session, instructions) {
    let result = await this.speak(session.id, instructions);
    if (result.spoken || session.transport === "twilio") return result.spoken;
    const waitMs = Math.min(
      Math.max(0, this.params.config.chrome.waitForInCallMs),
      Math.max(0, this.params.config.chrome.joinTimeoutMs),
    );
    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline) {
      await sleep(Math.min(250, Math.max(0, deadline - Date.now())));
      result = await this.speak(session.id, instructions);
      if (result.spoken) return true;
      const health = result.session?.chrome?.health;
      if (health?.manualActionRequired || result.session?.state !== "active") return false;
      const blocked = health?.speechBlockedReason;
      if (
        blocked &&
        blocked !== "not-in-call" &&
        blocked !== "browser-unverified" &&
        blocked !== "meet-microphone-muted"
      )
        return false;
    }
    return false;
  }
  async testSpeech(request) {
    if (request.mode === "transcribe")
      throw new Error(
        "test_speech requires mode: agent or bidi; use join mode: transcribe for observe-only sessions.",
      );
    const requestedMode = request.mode ? resolveMode(request.mode, this.params.config) : void 0;
    const mode =
      requestedMode && isGoogleMeetTalkBackMode$1(requestedMode)
        ? requestedMode
        : isGoogleMeetTalkBackMode$1(this.params.config.defaultMode)
          ? this.params.config.defaultMode
          : "agent";
    const url = normalizeMeetUrl(request.url);
    const transport = resolveTransport(request.transport, this.params.config);
    const agentId = resolveSessionAgentId(request, this.params.config);
    const beforeSessions = this.list();
    const before = new Set(beforeSessions.map((session) => session.id));
    const existingSession = beforeSessions.find((session) =>
      isReusableMeetSession(session, {
        url,
        transport,
        mode,
        agentId,
      }),
    );
    const existingOutputBytes = existingSession?.chrome?.health?.lastOutputBytes ?? 0;
    const result = await this.join({
      ...request,
      transport,
      url,
      mode,
      message: request.message ?? "Say exactly: Google Meet speech test complete.",
    });
    const startOutputBytes = existingSession?.id === result.session.id ? existingOutputBytes : 0;
    let health = result.session.chrome?.health;
    const shouldWaitForOutput =
      result.spoken === true &&
      health?.manualActionRequired !== true &&
      this.#sessionHealth.has(result.session.id);
    if (shouldWaitForOutput && !hasRealtimeAudioOutputAdvanced(health, startOutputBytes)) {
      const deadline = Date.now() + Math.min(this.params.config.chrome.joinTimeoutMs, 5e3);
      while (Date.now() < deadline) {
        await sleep(100);
        this.#refreshHealth(result.session.id);
        health = result.session.chrome?.health;
        if (hasRealtimeAudioOutputAdvanced(health, startOutputBytes)) break;
      }
    }
    const speechOutputVerified = hasRealtimeAudioOutputAdvanced(health, startOutputBytes);
    return {
      createdSession: !before.has(result.session.id),
      inCall: health?.inCall,
      manualActionRequired: health?.manualActionRequired,
      manualActionReason: health?.manualActionReason,
      manualActionMessage: health?.manualActionMessage,
      spoken: result.spoken ?? false,
      speechOutputVerified,
      speechOutputTimedOut: shouldWaitForOutput && !speechOutputVerified,
      speechReady: health?.speechReady,
      speechBlockedReason: health?.speechBlockedReason,
      speechBlockedMessage: health?.speechBlockedMessage,
      audioOutputActive: health?.audioOutputActive,
      lastOutputBytes: health?.lastOutputBytes,
      session: result.session,
    };
  }
  async testListen(request) {
    const requestedMode = request.mode ? resolveMode(request.mode, this.params.config) : void 0;
    if (requestedMode && isGoogleMeetTalkBackMode$1(requestedMode))
      throw new Error(
        "test_listen requires mode: transcribe; use test_speech for talk-back sessions.",
      );
    const url = normalizeMeetUrl(request.url);
    const transport = resolveTransport(request.transport, this.params.config);
    if (transport === "twilio")
      throw new Error("test_listen supports chrome or chrome-node transports");
    const agentId = resolveSessionAgentId(request, this.params.config);
    const beforeSessions = this.list();
    const before = new Set(beforeSessions.map((session) => session.id));
    const existingSession = beforeSessions.find((session) =>
      isReusableMeetSession(session, {
        url,
        transport,
        mode: "transcribe",
        agentId,
      }),
    );
    const existingStart = transcriptCheckpoint(existingSession?.chrome?.health);
    const result = await this.join({
      ...request,
      transport,
      url,
      mode: "transcribe",
      message: void 0,
    });
    const start =
      existingSession?.id === result.session.id ? existingStart : transcriptCheckpoint(void 0);
    let health = result.session.chrome?.health;
    const timeoutMs = resolveProbeTimeoutMs(
      request.timeoutMs,
      this.params.config.chrome.joinTimeoutMs,
    );
    const shouldWait =
      health?.manualActionRequired !== true && isManagedChromeBrowserSession(result.session);
    if (shouldWait && !hasTranscriptAdvanced(health, start)) {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        await sleep(250);
        await this.#refreshCaptionHealthForSession(result.session);
        health = result.session.chrome?.health;
        if (health?.manualActionRequired || hasTranscriptAdvanced(health, start)) break;
      }
    }
    const listenVerified = hasTranscriptAdvanced(health, start);
    return {
      createdSession: !before.has(result.session.id),
      inCall: health?.inCall,
      manualActionRequired: health?.manualActionRequired,
      manualActionReason: health?.manualActionReason,
      manualActionMessage: health?.manualActionMessage,
      listenVerified,
      listenTimedOut: shouldWait && !listenVerified && health?.manualActionRequired !== true,
      captioning: health?.captioning,
      captionsEnabledAttempted: health?.captionsEnabledAttempted,
      transcriptLines: health?.transcriptLines,
      lastCaptionAt: health?.lastCaptionAt,
      lastCaptionSpeaker: health?.lastCaptionSpeaker,
      lastCaptionText: health?.lastCaptionText,
      recentTranscript: health?.recentTranscript,
      session: result.session,
    };
  }
  async #refreshCaptionHealthForSession(session) {
    if (session.mode !== "transcribe") {
      this.#refreshSpeechReadiness(session);
      return;
    }
    await this.#refreshBrowserHealthForChromeSession(session);
  }
  async #refreshStatusHealthForSession(session) {
    if (session.transport === "chrome" || session.transport === "chrome-node") {
      await this.#refreshBrowserHealthForChromeSession(session, {
        force: true,
        readOnly: true,
      });
      return;
    }
    if (session.transport === "twilio") {
      await this.#refreshTwilioVoiceCallStatus(session);
      return;
    }
    this.#refreshSpeechReadiness(session);
  }
  #markTwilioSessionEnded(session, reason) {
    session.state = "ended";
    session.updatedAt = nowIso();
    this.#sessionStops.delete(session.id);
    this.#sessionSpeakers.delete(session.id);
    this.#sessionHealth.delete(session.id);
    noteSession(session, reason);
  }
  async #refreshTwilioVoiceCallStatus(session) {
    const callId = session.twilio?.voiceCallId;
    if (!callId || session.state !== "active") {
      this.#refreshSpeechReadiness(session);
      return;
    }
    try {
      if (
        (
          await getMeetVoiceCallGatewayCall({
            gateway: this.#voiceCallGateway,
            callId,
          })
        ).found === false
      )
        this.#markTwilioSessionEnded(session, "Voice Call is no longer active.");
    } catch (error) {
      this.params.logger.debug?.(
        `[google-meet] voice-call status refresh ignored: ${formatErrorMessage$1(error)}`,
      );
    }
    this.#refreshSpeechReadiness(session);
  }
  async #refreshBrowserHealthForChromeSession(session, options = {}) {
    if (!isManagedChromeBrowserSession(session)) {
      this.#refreshSpeechReadiness(session);
      return;
    }
    if (
      !options.force &&
      isGoogleMeetTalkBackMode$1(session.mode) &&
      evaluateSpeechReadiness(session).ready
    ) {
      this.#refreshSpeechReadiness(session);
      return;
    }
    try {
      const result =
        session.transport === "chrome-node"
          ? await recoverCurrentMeetTabOnNode({
              runtime: this.params.runtime,
              config: this.params.config,
              mode: session.mode,
              readOnly: options.readOnly,
              url: session.url,
            })
          : await recoverCurrentMeetTab({
              runtime: this.params.runtime,
              config: this.params.config,
              mode: session.mode,
              readOnly: options.readOnly,
              url: session.url,
            });
      if (result.found && result.browser && session.chrome) {
        session.chrome.health = {
          ...session.chrome.health,
          ...result.browser,
        };
        session.updatedAt = nowIso();
      }
    } catch (error) {
      this.params.logger.debug?.(
        `[google-meet] browser readiness refresh ignored: ${formatErrorMessage$1(error)}`,
      );
    }
    this.#refreshSpeechReadiness(session);
  }
  #attachChromeAudioBridge(session, audioBridge) {
    if (!session.chrome || !audioBridge) return;
    session.chrome.audioBridge = {
      type: audioBridge.type,
      provider:
        audioBridge.type === "command-pair" || audioBridge.type === "node-command-pair"
          ? audioBridge.providerId
          : void 0,
    };
    if (audioBridge.type === "command-pair" || audioBridge.type === "node-command-pair") {
      this.#sessionStops.set(session.id, audioBridge.stop);
      this.#sessionSpeakers.set(session.id, audioBridge.speak);
      this.#sessionHealth.set(session.id, audioBridge.getHealth);
    }
  }
  async #ensureChromeRealtimeBridge(session) {
    if (
      !isGoogleMeetTalkBackMode$1(session.mode) ||
      session.transport !== "chrome" ||
      session.state !== "active" ||
      !session.chrome ||
      session.chrome.audioBridge
    )
      return;
    const health = session.chrome.health;
    if (health?.inCall !== true || health.micMuted === true || health.manualActionRequired === true)
      return;
    const sessionConfig = withSessionAgentConfig(this.params.config, session.agentId);
    const result = await launchChromeMeet({
      runtime: this.params.runtime,
      config: {
        ...sessionConfig,
        chrome: {
          ...sessionConfig.chrome,
          launch: false,
        },
      },
      fullConfig: this.params.fullConfig,
      meetingSessionId: session.id,
      mode: session.mode,
      url: session.url,
      logger: this.params.logger,
    });
    this.#attachChromeAudioBridge(session, result.audioBridge);
    session.updatedAt = nowIso();
  }
  #refreshSpeechReadiness(session) {
    const readiness = evaluateSpeechReadiness(session);
    if (readiness.ready)
      session.notes = session.notes.filter((note) => !note.startsWith("Realtime speech blocked:"));
    if (session.chrome)
      session.chrome.health = {
        ...session.chrome.health,
        speechReady: readiness.ready,
        speechBlockedReason: readiness.reason,
        speechBlockedMessage: readiness.message,
      };
    return readiness;
  }
  #refreshHealth(sessionId) {
    const ids = sessionId ? [sessionId] : [...this.#sessionHealth.keys()];
    for (const id of ids) {
      const session = this.#sessions.get(id);
      const getHealth = this.#sessionHealth.get(id);
      if (!session?.chrome || !getHealth) continue;
      session.chrome.health = {
        ...session.chrome.health,
        ...getHealth(),
      };
      this.#refreshSpeechReadiness(session);
    }
  }
};
//#endregion
//#region extensions/google-meet/index.ts
const loadGoogleMeetCreateModule = createLazyRuntimeModule(
  () => import("../../create-BBa57Uk6.js"),
);
const loadGoogleMeetCliModule = createLazyRuntimeModule(() => import("../../cli-C5xZxsz3.js"));
const googleMeetConfigSchema = {
  parse(value) {
    return resolveGoogleMeetConfig(value);
  },
  uiHints: {
    "defaults.meeting": {
      label: "Default Meeting",
      help: "Meet URL, meeting code, or spaces/{id} used when CLI commands omit a meeting.",
    },
    "preview.enrollmentAcknowledged": {
      label: "Preview Acknowledged",
      help: "Confirms you understand the Google Meet Media API is still Developer Preview.",
      advanced: true,
    },
    defaultTransport: {
      label: "Default Transport",
      help: "Chrome uses a signed-in browser profile. Chrome-node runs Chrome on a paired node. Twilio uses Meet dial-in numbers.",
    },
    defaultMode: {
      label: "Default Mode",
      help: "Agent uses realtime transcription plus regular OpenClaw TTS. Bidi uses the realtime voice model directly. Transcribe observes only.",
    },
    "chrome.audioBackend": {
      label: "Chrome Audio Backend",
      help: "BlackHole 2ch is required for local duplex audio routing.",
    },
    "chrome.launch": { label: "Launch Chrome" },
    "chrome.browserProfile": {
      label: "Chrome Profile",
      advanced: true,
    },
    "chrome.guestName": {
      label: "Guest Name",
      help: "Used when Chrome lands on the signed-out Meet guest-name screen.",
    },
    "chrome.reuseExistingTab": {
      label: "Reuse Existing Meet Tab",
      help: "Avoids opening duplicate tabs for the same Meet URL.",
    },
    "chrome.autoJoin": {
      label: "Auto Join Guest Screen",
      help: "Best-effort guest-name fill and Join Now click through OpenClaw browser automation.",
    },
    "chrome.waitForInCallMs": {
      label: "Wait For In-Call (ms)",
      help: "Waits for Chrome to report that the Meet tab is in-call before the realtime intro speaks.",
      advanced: true,
    },
    "chrome.audioFormat": {
      label: "Audio Format",
      help: "Command-pair audio format. PCM16 24 kHz is the default Chrome/Meet path; G.711 mu-law 8 kHz remains available for legacy command pairs.",
      advanced: true,
    },
    "chrome.audioBufferBytes": {
      label: "Audio Buffer Bytes",
      help: "SoX processing buffer for generated Chrome command-pair audio commands. Lower values reduce latency but may underrun on busy hosts.",
      advanced: true,
    },
    "chrome.audioInputCommand": {
      label: "Audio Input Command",
      help: "Command that writes meeting audio to stdout in chrome.audioFormat.",
      advanced: true,
    },
    "chrome.audioOutputCommand": {
      label: "Audio Output Command",
      help: "Command that reads assistant audio from stdin in chrome.audioFormat.",
      advanced: true,
    },
    "chrome.bargeInInputCommand": {
      label: "Barge-In Input Command",
      help: "Optional Gateway-hosted microphone command that writes signed 16-bit little-endian mono PCM for human interruption detection while assistant playback is active.",
      advanced: true,
    },
    "chrome.bargeInRmsThreshold": {
      label: "Barge-In RMS Threshold",
      help: "RMS level on chrome.bargeInInputCommand that counts as a human interruption.",
      advanced: true,
    },
    "chrome.bargeInPeakThreshold": {
      label: "Barge-In Peak Threshold",
      help: "Peak level on chrome.bargeInInputCommand that counts as a human interruption.",
      advanced: true,
    },
    "chrome.bargeInCooldownMs": {
      label: "Barge-In Cooldown (ms)",
      help: "Minimum delay between repeated barge-in clears.",
      advanced: true,
    },
    "chrome.audioBridgeCommand": {
      label: "Audio Bridge Command",
      advanced: true,
    },
    "chrome.audioBridgeHealthCommand": {
      label: "Audio Bridge Health Command",
      advanced: true,
    },
    "chromeNode.node": {
      label: "Chrome Node",
      help: "Node id/name/IP that owns Chrome, BlackHole, and SoX for chrome-node transport.",
      advanced: true,
    },
    "twilio.defaultDialInNumber": {
      label: "Default Dial-In Number",
      placeholder: "+15551234567",
    },
    "twilio.defaultPin": {
      label: "Default PIN",
      advanced: true,
    },
    "twilio.defaultDtmfSequence": {
      label: "Default DTMF Sequence",
      advanced: true,
    },
    "voiceCall.enabled": { label: "Delegate To Voice Call" },
    "voiceCall.gatewayUrl": {
      label: "Voice Call Gateway URL",
      advanced: true,
    },
    "voiceCall.token": {
      label: "Voice Call Gateway Token",
      sensitive: true,
      advanced: true,
    },
    "voiceCall.requestTimeoutMs": {
      label: "Voice Call Request Timeout (ms)",
      advanced: true,
    },
    "voiceCall.dtmfDelayMs": {
      label: "DTMF Wait Before PIN (ms)",
      help: "Leading Twilio wait time before playing a PIN-derived Meet DTMF sequence. Increase it if Meet asks for the PIN after DTMF was sent.",
      advanced: true,
    },
    "voiceCall.postDtmfSpeechDelayMs": {
      label: "Post-DTMF Speech Delay (ms)",
      help: "Delay before requesting the realtime intro greeting after Voice Call starts the Twilio leg.",
      advanced: true,
    },
    "voiceCall.introMessage": {
      label: "Voice Call Intro Message",
      advanced: true,
    },
    "realtime.strategy": {
      label: "Realtime Strategy",
      help: "Legacy realtime alias setting. Use mode=agent or mode=bidi for new Meet joins.",
    },
    "realtime.provider": {
      label: "Speech Provider",
      help: "Compatibility fallback for both realtime transcription and bidi voice. Prefer realtime.transcriptionProvider and realtime.voiceProvider for new configs.",
    },
    "realtime.transcriptionProvider": {
      label: "Realtime Transcription Provider",
      help: "Agent mode uses this provider to transcribe meeting audio before regular OpenClaw TTS answers.",
    },
    "realtime.voiceProvider": {
      label: "Bidi Voice Provider",
      help: "Bidi mode uses this realtime voice provider. Falls back to realtime.provider when unset.",
    },
    "realtime.model": {
      label: "Bidi Realtime Model",
      help: "Only used by mode=bidi. Agent mode answers with the configured OpenClaw agent and regular TTS.",
      advanced: true,
    },
    "realtime.instructions": {
      label: "Realtime Instructions",
      advanced: true,
    },
    "realtime.introMessage": {
      label: "Realtime Intro Message",
      help: "Spoken once when the realtime bridge is ready. Set to an empty string to join silently.",
    },
    "realtime.agentId": {
      label: "Realtime Consult Agent",
      help: 'OpenClaw agent id used by openclaw_agent_consult. Defaults to "main".',
      advanced: true,
    },
    "realtime.toolPolicy": {
      label: "Realtime Tool Policy",
      help: "Safe read-only tools are available by default; owner requests can unlock broader tools.",
      advanced: true,
    },
    "oauth.clientId": { label: "OAuth Client ID" },
    "oauth.clientSecret": {
      label: "OAuth Client Secret",
      sensitive: true,
    },
    "oauth.refreshToken": {
      label: "OAuth Refresh Token",
      sensitive: true,
    },
    "oauth.accessToken": {
      label: "Cached Access Token",
      sensitive: true,
      advanced: true,
    },
    "oauth.expiresAt": {
      label: "Cached Access Token Expiry",
      help: "Unix epoch milliseconds used only for the cached access-token fast path.",
      advanced: true,
    },
  },
};
const GoogleMeetToolSchema = Type.Object({
  action: Type.String({
    enum: [
      "join",
      "create",
      "status",
      "transcript",
      "setup_status",
      "resolve_space",
      "preflight",
      "latest",
      "calendar_events",
      "artifacts",
      "attendance",
      "export",
      "recover_current_tab",
      "leave",
      "end_active_conference",
      "speak",
      "test_speech",
      "test_listen",
    ],
    description:
      "Google Meet action to run. create creates and joins by default; pass join=false to only mint a URL. After a timeout or unclear browser state, call recover_current_tab before retrying join.",
  }),
  join: Type.Optional(
    Type.Boolean({
      description: "For action=create, set false to create the URL without joining.",
    }),
  ),
  accessType: Type.Optional(
    Type.String({
      enum: ["OPEN", "TRUSTED", "RESTRICTED"],
      description:
        "For action=create with Google Meet OAuth, configure who can join without knocking.",
    }),
  ),
  entryPointAccess: Type.Optional(
    Type.String({
      enum: ["ALL", "CREATOR_APP_ONLY"],
      description: "For action=create with Google Meet OAuth, configure allowed join entry points.",
    }),
  ),
  url: Type.Optional(Type.String({ description: "Explicit https://meet.google.com/... URL" })),
  transport: Type.Optional(
    Type.String({
      enum: ["chrome", "chrome-node", "twilio"],
      description: "Join transport",
    }),
  ),
  mode: Type.Optional(
    Type.String({
      enum: ["agent", "bidi", "transcribe"],
      description:
        "Join mode. agent uses realtime transcription, the configured OpenClaw agent, and regular TTS. bidi uses the realtime voice model directly. transcribe joins observe-only.",
    }),
  ),
  dialInNumber: Type.Optional(
    Type.String({
      description:
        "Meet dial-in phone number for Twilio. Required for Twilio unless twilio.defaultDialInNumber is configured; Meet URLs cannot be dialed directly.",
    }),
  ),
  pin: Type.Optional(
    Type.String({ description: "Meet phone PIN for Twilio; # is appended if omitted" }),
  ),
  dtmfSequence: Type.Optional(Type.String({ description: "Explicit DTMF sequence for Twilio" })),
  sessionId: Type.Optional(Type.String({ description: "Meet session ID" })),
  sinceIndex: Type.Optional(
    Type.Integer({
      description: "For transcript, resume from the previous response's nextIndex.",
      minimum: 0,
    }),
  ),
  message: Type.Optional(Type.String({ description: "Realtime instructions to speak now" })),
  timeoutMs: optionalPositiveIntegerSchema({ description: "Probe timeout in milliseconds" }),
  meeting: Type.Optional(Type.String({ description: "Meet URL, meeting code, or spaces/{id}" })),
  today: Type.Optional(
    Type.Boolean({
      description: "For latest, artifacts, or attendance, find a Meet link on today's calendar.",
    }),
  ),
  event: Type.Optional(
    Type.String({
      description: "For latest, artifacts, or attendance, find a matching Calendar event.",
    }),
  ),
  calendarId: Type.Optional(Type.String({ description: "Calendar id for today/event lookup" })),
  conferenceRecord: Type.Optional(
    Type.String({ description: "Meet conferenceRecords/{id} resource name or id" }),
  ),
  pageSize: optionalPositiveIntegerSchema({ description: "Meet API page size for list actions" }),
  includeTranscriptEntries: Type.Optional(
    Type.Boolean({ description: "For artifacts, include structured transcript entries" }),
  ),
  includeDocumentBodies: Type.Optional(
    Type.Boolean({
      description:
        "For artifacts/export, export linked transcript and smart-note Google Docs text through Drive.",
    }),
  ),
  outputDir: Type.Optional(Type.String({ description: "For export, output directory" })),
  zip: Type.Optional(Type.Boolean({ description: "For export, also write a .zip archive" })),
  dryRun: Type.Optional(
    Type.Boolean({ description: "For export, return the manifest without writing files." }),
  ),
  includeAllConferenceRecords: Type.Optional(
    Type.Boolean({
      description:
        "For artifacts, attendance, or export with meeting input, fetch all conference records instead of only the latest.",
    }),
  ),
  mergeDuplicateParticipants: Type.Optional(
    Type.Boolean({ description: "For attendance, merge duplicate participant resources." }),
  ),
  lateAfterMinutes: optionalPositiveIntegerSchema({
    description: "For attendance, mark participants late after this many minutes.",
  }),
  earlyBeforeMinutes: optionalPositiveIntegerSchema({
    description: "For attendance, mark early leavers before this many minutes.",
  }),
  accessToken: Type.Optional(Type.String({ description: "Access token override" })),
  refreshToken: Type.Optional(Type.String({ description: "Refresh token override" })),
  clientId: Type.Optional(Type.String({ description: "OAuth client id override" })),
  clientSecret: Type.Optional(Type.String({ description: "OAuth client secret override" })),
  expiresAt: Type.Optional(Type.Number({ description: "Cached access token expiry ms" })),
});
function asParamRecord(params) {
  return params && typeof params === "object" && !Array.isArray(params) ? params : {};
}
function normalizeTransport(value) {
  return value === "chrome" || value === "chrome-node" || value === "twilio" ? value : void 0;
}
function normalizeMode(value) {
  if (value === "realtime") return "agent";
  return value === "agent" || value === "bidi" || value === "transcribe" ? value : void 0;
}
function isGoogleMeetTalkBackMode(mode) {
  return mode === "agent" || mode === "bidi";
}
function resolveMeetingInput(config, value) {
  const meeting = normalizeOptionalString(value) ?? config.defaults.meeting;
  if (!meeting) throw new Error("Meeting input is required");
  return meeting;
}
function shouldJoinCreatedMeet(raw) {
  return raw.join !== false && raw.join !== "false";
}
const googleMeetToolDeps = {
  callGatewayFromCli,
  platform: () => process.platform,
};
const testing = {
  setCallGatewayFromCliForTests(next) {
    googleMeetToolDeps.callGatewayFromCli = next ?? callGatewayFromCli;
  },
  setPlatformForTests(next) {
    googleMeetToolDeps.platform = next ?? (() => process.platform);
  },
  isGoogleMeetAgentToolActionUnsupportedOnHost,
  resolveGoogleMeetGatewayOperationTimeoutMs,
};
function googleMeetGatewayMethodForToolAction(action) {
  switch (action) {
    case "recover_current_tab":
      return "googlemeet.recoverCurrentTab";
    case "setup_status":
      return "googlemeet.setup";
    case "test_speech":
      return "googlemeet.testSpeech";
    case "test_listen":
      return "googlemeet.testListen";
    case "end_active_conference":
      return "googlemeet.endActiveConference";
    default:
      return `googlemeet.${action}`;
  }
}
function isGoogleMeetAgentToolActionUnsupportedOnHost(params) {
  if ((params.platform ?? googleMeetToolDeps.platform()) === "darwin") return false;
  const action = params.raw.action;
  if (
    action !== "join" &&
    action !== "test_speech" &&
    !(action === "create" && shouldJoinCreatedMeet(params.raw))
  )
    return false;
  const transport = normalizeTransport(params.raw.transport) ?? params.config.defaultTransport;
  const mode =
    action === "test_speech"
      ? "agent"
      : (normalizeMode(params.raw.mode) ?? params.config.defaultMode);
  return transport === "chrome" && isGoogleMeetTalkBackMode(mode);
}
function assertGoogleMeetAgentToolActionSupported(params) {
  if (!isGoogleMeetAgentToolActionUnsupportedOnHost(params)) return;
  throw new Error(
    "Google Meet local Chrome talk-back audio is macOS-only. On this host, use mode: transcribe, transport: twilio, or transport: chrome-node backed by a macOS node.",
  );
}
function readGatewayErrorDetails(err) {
  if (!err || typeof err !== "object" || !("details" in err)) return;
  return err.details;
}
async function callGoogleMeetGatewayFromTool(params) {
  try {
    if (params.runtime)
      return await params.runtime.gateway.request(
        googleMeetGatewayMethodForToolAction(params.action),
        params.raw,
        {
          timeoutMs: resolveGoogleMeetGatewayOperationTimeoutMs(params.config),
          scopes: ["operator.admin"],
        },
      );
    return await googleMeetToolDeps.callGatewayFromCli(
      googleMeetGatewayMethodForToolAction(params.action),
      {
        json: true,
        timeout: String(resolveGoogleMeetGatewayOperationTimeoutMs(params.config)),
      },
      params.raw,
      {
        progress: false,
        scopes: ["operator.admin"],
      },
    );
  } catch (err) {
    const details = readGatewayErrorDetails(err);
    if (details && typeof details === "object") return details;
    throw err;
  }
}
function keepTrustedToolAgentId(raw, client) {
  const { agentId: rawAgentId, ...rest } = raw;
  if (client?.internal?.pluginRuntimeOwnerId !== "google-meet") return rest;
  const agentId = normalizeOptionalString(rawAgentId);
  return agentId
    ? {
        ...rest,
        agentId,
      }
    : rest;
}
async function createMeetFromParams(params) {
  return (await loadGoogleMeetCreateModule()).createMeetFromParams(params);
}
async function createAndJoinMeetFromParams(params) {
  return (await loadGoogleMeetCreateModule()).createAndJoinMeetFromParams(params);
}
async function resolveGoogleMeetTokenFromParams(config, raw) {
  const { resolveGoogleMeetAccessToken } = await import("../../oauth-T7j99Rpy.js");
  return resolveGoogleMeetAccessToken({
    clientId: normalizeOptionalString(raw.clientId) ?? config.oauth.clientId,
    clientSecret: normalizeOptionalString(raw.clientSecret) ?? config.oauth.clientSecret,
    refreshToken: normalizeOptionalString(raw.refreshToken) ?? config.oauth.refreshToken,
    accessToken: normalizeOptionalString(raw.accessToken) ?? config.oauth.accessToken,
    expiresAt: typeof raw.expiresAt === "number" ? raw.expiresAt : config.oauth.expiresAt,
  });
}
function wantsCalendarLookup(raw) {
  return raw.today === true || Boolean(normalizeOptionalString(raw.event));
}
async function resolveMeetingFromParams(params) {
  if (wantsCalendarLookup(params.raw)) {
    const window = params.raw.today === true ? buildGoogleMeetCalendarDayWindow() : {};
    const calendarEvent = await findGoogleMeetCalendarEvent({
      accessToken: params.accessToken,
      calendarId: normalizeOptionalString(params.raw.calendarId),
      eventQuery: normalizeOptionalString(params.raw.event),
      ...window,
    });
    return {
      meeting: calendarEvent.meetingUri,
      calendarEvent,
    };
  }
  return { meeting: resolveMeetingInput(params.config, params.raw.meeting) };
}
async function resolveSpaceFromParams(config, raw) {
  const token = await resolveGoogleMeetTokenFromParams(config, raw);
  const { meeting, calendarEvent } = await resolveMeetingFromParams({
    config,
    raw,
    accessToken: token.accessToken,
  });
  return {
    meeting,
    token,
    space: await fetchGoogleMeetSpace({
      accessToken: token.accessToken,
      meeting,
    }),
    calendarEvent,
  };
}
async function resolveArtifactQueryFromParams(config, raw) {
  const meeting = normalizeOptionalString(raw.meeting) ?? config.defaults.meeting;
  const conferenceRecord = normalizeOptionalString(raw.conferenceRecord);
  const token = await resolveGoogleMeetTokenFromParams(config, raw);
  const resolvedMeeting = conferenceRecord
    ? { meeting }
    : wantsCalendarLookup(raw)
      ? await resolveMeetingFromParams({
          config,
          raw,
          accessToken: token.accessToken,
        })
      : { meeting };
  if (!resolvedMeeting.meeting && !conferenceRecord)
    throw new Error("Meeting input, calendar lookup, or conferenceRecord required");
  return {
    token,
    meeting: resolvedMeeting.meeting,
    calendarEvent: resolvedMeeting.calendarEvent,
    conferenceRecord,
    pageSize: readPositiveIntegerParam(raw, "pageSize"),
    includeTranscriptEntries: raw.includeTranscriptEntries !== false,
    includeDocumentBodies: raw.includeDocumentBodies === true,
    allConferenceRecords: raw.includeAllConferenceRecords === true,
    mergeDuplicateParticipants: raw.mergeDuplicateParticipants !== false,
    lateAfterMinutes: readPositiveIntegerParam(raw, "lateAfterMinutes"),
    earlyBeforeMinutes: readPositiveIntegerParam(raw, "earlyBeforeMinutes"),
  };
}
async function exportGoogleMeetBundleFromParams(config, raw) {
  const resolved = await resolveArtifactQueryFromParams(config, raw);
  const [artifacts, attendance] = await Promise.all([
    fetchGoogleMeetArtifacts({
      accessToken: resolved.token.accessToken,
      meeting: resolved.meeting,
      conferenceRecord: resolved.conferenceRecord,
      pageSize: resolved.pageSize,
      includeTranscriptEntries: resolved.includeTranscriptEntries,
      includeDocumentBodies: resolved.includeDocumentBodies,
      allConferenceRecords: resolved.allConferenceRecords,
    }),
    fetchGoogleMeetAttendance({
      accessToken: resolved.token.accessToken,
      meeting: resolved.meeting,
      conferenceRecord: resolved.conferenceRecord,
      pageSize: resolved.pageSize,
      allConferenceRecords: resolved.allConferenceRecords,
      mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
      lateAfterMinutes: resolved.lateAfterMinutes,
      earlyBeforeMinutes: resolved.earlyBeforeMinutes,
    }),
  ]);
  const { buildGoogleMeetExportManifest, googleMeetExportFileNames, writeMeetExportBundle } =
    await loadGoogleMeetCliModule();
  const calendarId = normalizeOptionalString(raw.calendarId);
  const request = {
    ...(resolved.meeting ? { meeting: resolved.meeting } : {}),
    ...(resolved.conferenceRecord ? { conferenceRecord: resolved.conferenceRecord } : {}),
    ...(resolved.calendarEvent?.event.id
      ? { calendarEventId: resolved.calendarEvent.event.id }
      : {}),
    ...(resolved.calendarEvent?.event.summary
      ? { calendarEventSummary: resolved.calendarEvent.event.summary }
      : {}),
    ...(calendarId ? { calendarId } : {}),
    ...(resolved.pageSize !== void 0 ? { pageSize: resolved.pageSize } : {}),
    includeTranscriptEntries: resolved.includeTranscriptEntries,
    includeDocumentBodies: resolved.includeDocumentBodies,
    allConferenceRecords: resolved.allConferenceRecords,
    mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
    ...(resolved.lateAfterMinutes !== void 0
      ? { lateAfterMinutes: resolved.lateAfterMinutes }
      : {}),
    ...(resolved.earlyBeforeMinutes !== void 0
      ? { earlyBeforeMinutes: resolved.earlyBeforeMinutes }
      : {}),
  };
  const tokenSource = resolved.token.refreshed ? "refresh-token" : "cached-access-token";
  if (raw.dryRun === true)
    return {
      dryRun: true,
      manifest: buildGoogleMeetExportManifest({
        artifacts,
        attendance,
        files: googleMeetExportFileNames(),
        request,
        tokenSource,
        ...(resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}),
      }),
      ...(resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}),
      tokenSource,
    };
  const outputDir = normalizeOptionalString(raw.outputDir) ?? normalizeOptionalString(raw.output);
  return {
    ...(await writeMeetExportBundle({
      ...(outputDir ? { outputDir } : {}),
      artifacts,
      attendance,
      zip: raw.zip === true,
      request,
      tokenSource,
      ...(resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}),
    })),
    ...(resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}),
    tokenSource,
  };
}
var google_meet_default = definePluginEntry({
  id: "google-meet",
  name: "Google Meet",
  description: "Join Google Meet calls through Chrome or Twilio transports",
  configSchema: googleMeetConfigSchema,
  register(api) {
    const config = googleMeetConfigSchema.parse(api.pluginConfig);
    let runtime = null;
    const ensureRuntime = async () => {
      if (!config.enabled) throw new Error("Google Meet plugin disabled in plugin config");
      if (!runtime)
        runtime = new GoogleMeetRuntime({
          config,
          fullConfig: api.config,
          runtime: api.runtime,
          logger: api.logger,
        });
      return runtime;
    };
    const formatGatewayError = (err) =>
      isGoogleMeetBrowserManualActionError(err)
        ? err.payload
        : { error: formatErrorMessage$1(err) };
    const sendError = (respond, err, code = ErrorCodes.UNAVAILABLE) => {
      const payload = formatGatewayError(err);
      respond(
        false,
        payload,
        errorShape(
          code,
          typeof payload.error === "string" ? payload.error : "Google Meet request failed",
          { details: payload },
        ),
      );
    };
    api.registerGatewayMethod("googlemeet.join", async ({ params, client, respond }) => {
      try {
        const trustedParams = keepTrustedToolAgentId(asParamRecord(params), client);
        respond(
          true,
          await (
            await ensureRuntime()
          ).join({
            url: resolveMeetingInput(config, trustedParams.url),
            transport: normalizeTransport(trustedParams.transport),
            mode: normalizeMode(trustedParams.mode),
            dialInNumber: normalizeOptionalString(trustedParams.dialInNumber),
            pin: normalizeOptionalString(trustedParams.pin),
            dtmfSequence: normalizeOptionalString(trustedParams.dtmfSequence),
            message: normalizeOptionalString(trustedParams.message),
            requesterSessionKey: normalizeOptionalString(trustedParams.requesterSessionKey),
            agentId: normalizeOptionalString(trustedParams.agentId),
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.create", async ({ params, client, respond }) => {
      try {
        const raw = keepTrustedToolAgentId(asParamRecord(params), client);
        respond(
          true,
          shouldJoinCreatedMeet(raw)
            ? await createAndJoinMeetFromParams({
                config,
                runtime: api.runtime,
                raw,
                ensureRuntime,
              })
            : await createMeetFromParams({
                config,
                runtime: api.runtime,
                raw,
              }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.status", async ({ params, respond }) => {
      try {
        respond(
          true,
          await (await ensureRuntime()).status(normalizeOptionalString(params?.sessionId)),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.transcript", async ({ params, respond }) => {
      try {
        const sessionId = normalizeOptionalString(params?.sessionId);
        if (!sessionId) {
          sendError(
            respond,
            /* @__PURE__ */ new Error("sessionId required"),
            ErrorCodes.INVALID_REQUEST,
          );
          return;
        }
        const sinceIndex = params?.sinceIndex;
        if (
          sinceIndex !== void 0 &&
          (typeof sinceIndex !== "number" || !Number.isSafeInteger(sinceIndex) || sinceIndex < 0)
        ) {
          sendError(
            respond,
            /* @__PURE__ */ new Error("sinceIndex must be a non-negative safe integer"),
            ErrorCodes.INVALID_REQUEST,
          );
          return;
        }
        respond(
          true,
          await (
            await ensureRuntime()
          ).transcript(sessionId, sinceIndex === void 0 ? {} : { sinceIndex }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.recoverCurrentTab", async ({ params, respond }) => {
      try {
        respond(
          true,
          await (
            await ensureRuntime()
          ).recoverCurrentTab({
            url: normalizeOptionalString(params?.url),
            transport: normalizeTransport(params?.transport),
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.setup", async ({ params, respond }) => {
      try {
        respond(
          true,
          await (
            await ensureRuntime()
          ).setupStatus({
            transport: normalizeTransport(params?.transport),
            mode: normalizeMode(params?.mode),
            dialInNumber: normalizeOptionalString(params?.dialInNumber),
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.latest", async ({ params, respond }) => {
      try {
        const raw = asParamRecord(params);
        const token = await resolveGoogleMeetTokenFromParams(config, raw);
        const resolved = await resolveMeetingFromParams({
          config,
          raw,
          accessToken: token.accessToken,
        });
        respond(true, {
          ...(await fetchLatestGoogleMeetConferenceRecord({
            accessToken: token.accessToken,
            meeting: resolved.meeting,
          })),
          ...(resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}),
        });
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.calendarEvents", async ({ params, respond }) => {
      try {
        const raw = asParamRecord(params);
        const token = await resolveGoogleMeetTokenFromParams(config, raw);
        const window = raw.today === true ? buildGoogleMeetCalendarDayWindow() : {};
        respond(
          true,
          await listGoogleMeetCalendarEvents({
            accessToken: token.accessToken,
            calendarId: normalizeOptionalString(raw.calendarId),
            eventQuery: normalizeOptionalString(raw.event),
            ...window,
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.artifacts", async ({ params, respond }) => {
      try {
        const raw = asParamRecord(params);
        const resolved = await resolveArtifactQueryFromParams(config, raw);
        respond(
          true,
          await fetchGoogleMeetArtifacts({
            accessToken: resolved.token.accessToken,
            meeting: resolved.meeting,
            conferenceRecord: resolved.conferenceRecord,
            pageSize: resolved.pageSize,
            includeTranscriptEntries: resolved.includeTranscriptEntries,
            includeDocumentBodies: resolved.includeDocumentBodies,
            allConferenceRecords: resolved.allConferenceRecords,
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.attendance", async ({ params, respond }) => {
      try {
        const raw = asParamRecord(params);
        const resolved = await resolveArtifactQueryFromParams(config, raw);
        respond(
          true,
          await fetchGoogleMeetAttendance({
            accessToken: resolved.token.accessToken,
            meeting: resolved.meeting,
            conferenceRecord: resolved.conferenceRecord,
            pageSize: resolved.pageSize,
            allConferenceRecords: resolved.allConferenceRecords,
            mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
            lateAfterMinutes: resolved.lateAfterMinutes,
            earlyBeforeMinutes: resolved.earlyBeforeMinutes,
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.export", async ({ params, respond }) => {
      try {
        respond(true, await exportGoogleMeetBundleFromParams(config, asParamRecord(params)));
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.leave", async ({ params, respond }) => {
      try {
        const sessionId = normalizeOptionalString(params?.sessionId);
        if (!sessionId) {
          sendError(
            respond,
            /* @__PURE__ */ new Error("sessionId required"),
            ErrorCodes.INVALID_REQUEST,
          );
          return;
        }
        respond(true, await (await ensureRuntime()).leave(sessionId));
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.endActiveConference", async ({ params, respond }) => {
      try {
        const raw = asParamRecord(params);
        respond(
          true,
          await endGoogleMeetActiveConference({
            accessToken: (await resolveGoogleMeetTokenFromParams(config, raw)).accessToken,
            meeting: resolveMeetingInput(config, raw.meeting),
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.speak", async ({ params, respond }) => {
      try {
        const sessionId = normalizeOptionalString(params?.sessionId);
        if (!sessionId) {
          sendError(
            respond,
            /* @__PURE__ */ new Error("sessionId required"),
            ErrorCodes.INVALID_REQUEST,
          );
          return;
        }
        respond(
          true,
          await (await ensureRuntime()).speak(sessionId, normalizeOptionalString(params?.message)),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.testSpeech", async ({ params, client, respond }) => {
      try {
        const trustedParams = keepTrustedToolAgentId(asParamRecord(params), client);
        respond(
          true,
          await (
            await ensureRuntime()
          ).testSpeech({
            url: resolveMeetingInput(config, trustedParams.url),
            transport: normalizeTransport(trustedParams.transport),
            mode: normalizeMode(trustedParams.mode),
            dialInNumber: normalizeOptionalString(trustedParams.dialInNumber),
            pin: normalizeOptionalString(trustedParams.pin),
            dtmfSequence: normalizeOptionalString(trustedParams.dtmfSequence),
            message: normalizeOptionalString(trustedParams.message),
            requesterSessionKey: normalizeOptionalString(trustedParams.requesterSessionKey),
            agentId: normalizeOptionalString(trustedParams.agentId),
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerGatewayMethod("googlemeet.testListen", async ({ params, client, respond }) => {
      try {
        const trustedParams = keepTrustedToolAgentId(asParamRecord(params), client);
        respond(
          true,
          await (
            await ensureRuntime()
          ).testListen({
            url: resolveMeetingInput(config, trustedParams.url),
            transport: normalizeTransport(trustedParams.transport),
            mode: normalizeMode(trustedParams.mode),
            agentId: normalizeOptionalString(trustedParams.agentId),
            timeoutMs: readPositiveIntegerParam(trustedParams, "timeoutMs"),
          }),
        );
      } catch (err) {
        sendError(respond, err);
      }
    });
    api.registerTool(
      (toolContext) => ({
        name: "google_meet",
        label: "Google Meet",
        description:
          "Join and track Google Meet sessions through Chrome or Twilio. Call setup_status before join/create/test_listen/test_speech; if it reports a Chrome node offline, local audio missing, or missing Twilio dial plan, surface that blocker instead of retrying or switching transports. Twilio cannot dial a Meet URL directly: provide dialInNumber plus optional pin/dtmfSequence, or configure twilio.defaultDialInNumber. Offline nodes are diagnostics only, not usable candidates. If local Chrome talk-back audio is unsupported on this OS, use mode=transcribe, transport=twilio, or a macOS chrome-node for agent/bidi Chrome. If a Meet tab is already open after a timeout, call recover_current_tab before retrying join to report login, permission, or admission blockers without opening another tab.",
        parameters: GoogleMeetToolSchema,
        async execute(_toolCallId, params) {
          const raw = asParamRecord(params);
          const requesterSessionKey = normalizeOptionalString(toolContext.sessionKey);
          const contextAgentId =
            toolContext.agentId ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
          const agentId = contextAgentId ? normalizeAgentId(contextAgentId) : void 0;
          try {
            const needsTrustedAgentRouting = Boolean(agentId && agentId !== "main");
            const useTrustedRuntime = needsTrustedAgentRouting
              ? await api.runtime.gateway.isAvailable()
              : false;
            if (needsTrustedAgentRouting && !useTrustedRuntime)
              throw new Error("Per-agent Google Meet routing requires a Gateway-hosted agent run.");
            const rawWithRequester = {
              ...raw,
              ...(requesterSessionKey ? { requesterSessionKey } : {}),
              ...(useTrustedRuntime ? { agentId } : {}),
            };
            assertGoogleMeetAgentToolActionSupported({
              config,
              raw,
            });
            switch (raw.action) {
              case "join":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "join",
                    raw: rawWithRequester,
                    runtime: useTrustedRuntime ? api.runtime : void 0,
                  }),
                );
              case "create":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "create",
                    raw: rawWithRequester,
                    runtime: useTrustedRuntime ? api.runtime : void 0,
                  }),
                );
              case "test_speech":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "test_speech",
                    raw: rawWithRequester,
                    runtime: useTrustedRuntime ? api.runtime : void 0,
                  }),
                );
              case "test_listen":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "test_listen",
                    raw: rawWithRequester,
                    runtime: useTrustedRuntime ? api.runtime : void 0,
                  }),
                );
              case "status":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "status",
                    raw,
                  }),
                );
              case "transcript":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "transcript",
                    raw,
                  }),
                );
              case "recover_current_tab":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "recover_current_tab",
                    raw,
                  }),
                );
              case "setup_status":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "setup_status",
                    raw,
                  }),
                );
              case "resolve_space": {
                const { token: _token, ...result } = await resolveSpaceFromParams(config, raw);
                return jsonResult(result);
              }
              case "preflight": {
                const { meeting, token, space } = await resolveSpaceFromParams(config, raw);
                return jsonResult(
                  buildGoogleMeetPreflightReport({
                    input: meeting,
                    space,
                    previewAcknowledged: config.preview.enrollmentAcknowledged,
                    tokenSource: token.refreshed ? "refresh-token" : "cached-access-token",
                  }),
                );
              }
              case "latest": {
                const token = await resolveGoogleMeetTokenFromParams(config, raw);
                const resolved = await resolveMeetingFromParams({
                  config,
                  raw,
                  accessToken: token.accessToken,
                });
                return jsonResult({
                  ...(await fetchLatestGoogleMeetConferenceRecord({
                    accessToken: token.accessToken,
                    meeting: resolved.meeting,
                  })),
                  ...(resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}),
                });
              }
              case "calendar_events": {
                const token = await resolveGoogleMeetTokenFromParams(config, raw);
                const window = raw.today === true ? buildGoogleMeetCalendarDayWindow() : {};
                return jsonResult(
                  await listGoogleMeetCalendarEvents({
                    accessToken: token.accessToken,
                    calendarId: normalizeOptionalString(raw.calendarId),
                    eventQuery: normalizeOptionalString(raw.event),
                    ...window,
                  }),
                );
              }
              case "artifacts": {
                const resolved = await resolveArtifactQueryFromParams(config, raw);
                return jsonResult(
                  await fetchGoogleMeetArtifacts({
                    accessToken: resolved.token.accessToken,
                    meeting: resolved.meeting,
                    conferenceRecord: resolved.conferenceRecord,
                    pageSize: resolved.pageSize,
                    includeTranscriptEntries: resolved.includeTranscriptEntries,
                    includeDocumentBodies: resolved.includeDocumentBodies,
                    allConferenceRecords: resolved.allConferenceRecords,
                  }),
                );
              }
              case "attendance": {
                const resolved = await resolveArtifactQueryFromParams(config, raw);
                return jsonResult(
                  await fetchGoogleMeetAttendance({
                    accessToken: resolved.token.accessToken,
                    meeting: resolved.meeting,
                    conferenceRecord: resolved.conferenceRecord,
                    pageSize: resolved.pageSize,
                    allConferenceRecords: resolved.allConferenceRecords,
                    mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
                    lateAfterMinutes: resolved.lateAfterMinutes,
                    earlyBeforeMinutes: resolved.earlyBeforeMinutes,
                  }),
                );
              }
              case "export":
                return jsonResult(await exportGoogleMeetBundleFromParams(config, raw));
              case "leave":
                if (!normalizeOptionalString(raw.sessionId)) throw new Error("sessionId required");
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "leave",
                    raw,
                  }),
                );
              case "end_active_conference":
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "end_active_conference",
                    raw,
                  }),
                );
              case "speak":
                if (!normalizeOptionalString(raw.sessionId)) throw new Error("sessionId required");
                return jsonResult(
                  await callGoogleMeetGatewayFromTool({
                    config,
                    action: "speak",
                    raw,
                  }),
                );
              default:
                throw new Error("unknown google_meet action");
            }
          } catch (err) {
            return jsonResult(formatGatewayError(err));
          }
        },
      }),
      { name: "google_meet" },
    );
    api.registerNodeHostCommand({
      command: GOOGLE_MEET_CHROME_NODE_COMMAND,
      cap: "google-meet",
      dangerous: true,
      handle: handleGoogleMeetNodeHostCommand,
    });
    api.registerNodeInvokePolicy(createGoogleMeetChromeNodeInvokePolicy(config));
    api.registerCli(
      async ({ program }) => {
        const { registerGoogleMeetCli } = await loadGoogleMeetCliModule();
        registerGoogleMeetCli({
          program,
          config,
          ensureRuntime,
        });
      },
      {
        commands: ["googlemeet"],
        descriptors: [
          {
            name: "googlemeet",
            description: "Join and manage Google Meet calls",
            hasSubcommands: true,
          },
        ],
      },
    );
  },
});
//#endregion
export { testing as __testing, testing, google_meet_default as default };
