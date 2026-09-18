import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./realtime-voice-DQqBL-aH.js";
//#region extensions/voice-call/src/telephony-audio.ts
/**
 * Chunk audio buffer into 20ms frames for streaming (8kHz mono mu-law).
 */
function chunkAudio(audio, chunkSize = 160) {
  return (function* () {
    for (let i = 0; i < audio.length; i += chunkSize)
      yield audio.subarray(i, Math.min(i + chunkSize, audio.length));
  })();
}
//#endregion
//#region extensions/voice-call/src/providers/shared/call-status.ts
const TERMINAL_PROVIDER_STATUS_TO_END_REASON = {
  completed: "completed",
  failed: "failed",
  busy: "busy",
  "no-answer": "no-answer",
  canceled: "hangup-bot",
};
/** Normalize provider status text, falling back to "unknown". */
function normalizeProviderStatus(status) {
  const normalized = normalizeOptionalLowercaseString(status);
  return normalized && normalized.length > 0 ? normalized : "unknown";
}
/** Map terminal provider status strings to OpenClaw end reasons. */
function mapProviderStatusToEndReason(status) {
  const normalized = normalizeProviderStatus(status);
  return TERMINAL_PROVIDER_STATUS_TO_END_REASON[normalized] ?? null;
}
/** Return true when a provider status is terminal. */
function isProviderStatusTerminal(status) {
  return mapProviderStatusToEndReason(status) !== null;
}
//#endregion
export {
  chunkAudio as i,
  mapProviderStatusToEndReason as n,
  normalizeProviderStatus as r,
  isProviderStatusTerminal as t,
};
