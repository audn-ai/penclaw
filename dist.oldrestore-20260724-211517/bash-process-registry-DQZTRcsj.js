import { c as readEnvInt } from "./bash-tools.shared-BjYufFPv.js";
import { r as generateSecureInt } from "./secure-random-Ds4AFLgz.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/session-slug.ts
/**
 * Human-readable session slug generator.
 * Produces short adjective/noun IDs with numbered and random fallbacks when
 * collisions are reported by the session store.
 */
const SLUG_ADJECTIVES = [
  "amber",
  "briny",
  "brisk",
  "calm",
  "clear",
  "cool",
  "crisp",
  "dawn",
  "delta",
  "ember",
  "faint",
  "fast",
  "fresh",
  "gentle",
  "glow",
  "good",
  "grand",
  "keen",
  "kind",
  "lucky",
  "marine",
  "mellow",
  "mild",
  "neat",
  "nimble",
  "nova",
  "oceanic",
  "plaid",
  "quick",
  "quiet",
  "rapid",
  "salty",
  "sharp",
  "swift",
  "tender",
  "tidal",
  "tidy",
  "tide",
  "vivid",
  "warm",
  "wild",
  "young",
];
const SLUG_NOUNS = [
  "atlas",
  "basil",
  "bison",
  "bloom",
  "breeze",
  "canyon",
  "cedar",
  "claw",
  "cloud",
  "comet",
  "coral",
  "cove",
  "crest",
  "crustacean",
  "daisy",
  "dune",
  "ember",
  "falcon",
  "fjord",
  "forest",
  "glade",
  "gulf",
  "harbor",
  "haven",
  "kelp",
  "lagoon",
  "lobster",
  "meadow",
  "mist",
  "nudibranch",
  "nexus",
  "ocean",
  "orbit",
  "otter",
  "pine",
  "prairie",
  "reef",
  "ridge",
  "river",
  "rook",
  "sable",
  "sage",
  "seaslug",
  "shell",
  "shoal",
  "shore",
  "slug",
  "summit",
  "tidepool",
  "trail",
  "valley",
  "wharf",
  "willow",
  "zephyr",
];
function randomChoice(values, fallback) {
  return values[generateSecureInt(values.length)] ?? fallback;
}
const SLUG_FALLBACK_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
function createFallbackSuffix(length) {
  let suffix = "";
  for (let i = 0; i < length; i += 1)
    suffix += SLUG_FALLBACK_ALPHABET[generateSecureInt(36)] ?? "x";
  return suffix;
}
function createSlugBase(words = 2) {
  const parts = [randomChoice(SLUG_ADJECTIVES, "steady"), randomChoice(SLUG_NOUNS, "harbor")];
  if (words > 2) parts.push(randomChoice(SLUG_NOUNS, "reef"));
  return parts.join("-");
}
function createAvailableSlug(words, isIdTaken) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const base = createSlugBase(words);
    if (!isIdTaken(base)) return base;
    for (let i = 2; i <= 12; i += 1) {
      const candidate = `${base}-${i}`;
      if (!isIdTaken(candidate)) return candidate;
    }
  }
}
/** Creates a human-readable unique session slug with numbered and random fallbacks. */
function createSessionSlug$1(isTaken) {
  const isIdTaken = isTaken ?? (() => false);
  const twoWord = createAvailableSlug(2, isIdTaken);
  if (twoWord) return twoWord;
  const threeWord = createAvailableSlug(3, isIdTaken);
  if (threeWord) return threeWord;
  const fallback = `${createSlugBase(3)}-${createFallbackSuffix(3)}`;
  return isIdTaken(fallback) ? `${fallback}-${Date.now().toString(36)}` : fallback;
}
//#endregion
//#region src/agents/bash-process-registry.ts
const DEFAULT_JOB_TTL_MS = 1800 * 1e3;
const MIN_JOB_TTL_MS = 60 * 1e3;
const MAX_JOB_TTL_MS = 10800 * 1e3;
const DEFAULT_PENDING_OUTPUT_CHARS = 3e4;
function clampTtl(value) {
  if (value === void 0 || Number.isNaN(value)) return DEFAULT_JOB_TTL_MS;
  return Math.min(Math.max(value, MIN_JOB_TTL_MS), MAX_JOB_TTL_MS);
}
let jobTtlMs = clampTtl(readEnvInt("OPENCLAW_BASH_JOB_TTL_MS", "PI_BASH_JOB_TTL_MS"));
const runningSessions = /* @__PURE__ */ new Map();
const finishedSessions = /* @__PURE__ */ new Map();
const activeBackgroundExecSessionIds = /* @__PURE__ */ new Set();
let sweeper = null;
function isSessionIdTaken(id) {
  return (
    runningSessions.has(id) || finishedSessions.has(id) || activeBackgroundExecSessionIds.has(id)
  );
}
/** Creates a unique short session id that avoids running and retained sessions. */
function createSessionSlug() {
  return createSessionSlug$1(isSessionIdTaken);
}
/** Adds a running session and starts retention sweeping if needed. */
function addSession(session) {
  runningSessions.set(session.id, session);
  startSweeper();
}
/** Returns a running session by id. */
function getSession(id) {
  return runningSessions.get(id);
}
/** Returns a retained finished background session by id. */
function getFinishedSession(id) {
  return finishedSessions.get(id);
}
/** Removes visible session records without changing live-process activity. */
function deleteSession(id) {
  runningSessions.delete(id);
  finishedSessions.delete(id);
}
/** Appends process output while enforcing aggregate and pending-output caps. */
function appendOutput(session, stream, chunk) {
  session.pendingStdout ??= [];
  session.pendingStderr ??= [];
  session.pendingStdoutChars ??= sumPendingChars(session.pendingStdout);
  session.pendingStderrChars ??= sumPendingChars(session.pendingStderr);
  const buffer = stream === "stdout" ? session.pendingStdout : session.pendingStderr;
  const bufferChars = stream === "stdout" ? session.pendingStdoutChars : session.pendingStderrChars;
  const pendingCap = Math.min(
    session.pendingMaxOutputChars ?? DEFAULT_PENDING_OUTPUT_CHARS,
    session.maxOutputChars,
  );
  buffer.push(chunk);
  let pendingChars = bufferChars + chunk.length;
  if (pendingChars > pendingCap) {
    session.truncated = true;
    pendingChars = capPendingBuffer(buffer, pendingChars, pendingCap);
  }
  if (stream === "stdout") session.pendingStdoutChars = pendingChars;
  else session.pendingStderrChars = pendingChars;
  session.totalOutputChars += chunk.length;
  const aggregated = trimWithCap(session.aggregated + chunk, session.maxOutputChars);
  session.truncated =
    session.truncated || aggregated.length < session.aggregated.length + chunk.length;
  session.aggregated = aggregated;
  session.tail = tail(session.aggregated, 2e3);
}
/** Drains pending stdout/stderr chunks returned by a process poll. */
function drainSession(session) {
  const stdout = session.pendingStdout.join("");
  const stderr = session.pendingStderr.join("");
  session.pendingStdout = [];
  session.pendingStderr = [];
  session.pendingStdoutChars = 0;
  session.pendingStderrChars = 0;
  return {
    stdout,
    stderr,
  };
}
/** Moves a session to finished state and records exit metadata. */
function markExited(session, exitCode, exitSignal, status, exitReason, noOutputTimedOut) {
  activeBackgroundExecSessionIds.delete(session.id);
  session.exited = true;
  session.exitCode = exitCode;
  session.exitSignal = exitSignal;
  session.exitReason = exitReason;
  session.noOutputTimedOut = noOutputTimedOut;
  session.tail = tail(session.aggregated, 2e3);
  moveToFinished(session, status);
}
/** Marks a running session as reconnectable after the exec call returns. */
function markBackgrounded(session) {
  session.backgrounded = true;
  if (!session.exited) activeBackgroundExecSessionIds.add(session.id);
}
/** Returns the number of live background exec sessions without exposing process details. */
function getActiveBackgroundExecSessionCount() {
  return activeBackgroundExecSessionIds.size;
}
function moveToFinished(session, status) {
  runningSessions.delete(session.id);
  if (session.child) {
    session.child.stdin?.destroy?.();
    session.child.stdout?.destroy?.();
    session.child.stderr?.destroy?.();
    session.child.removeAllListeners();
    delete session.child;
  }
  if (session.stdin) {
    if (typeof session.stdin.destroy === "function") session.stdin.destroy();
    else if (typeof session.stdin.end === "function") session.stdin.end();
    try {
      session.stdin.destroyed = true;
    } catch {}
    delete session.stdin;
  }
  if (!session.backgrounded) return;
  finishedSessions.set(session.id, {
    id: session.id,
    command: session.command,
    scopeKey: session.scopeKey,
    startedAt: session.startedAt,
    endedAt: Date.now(),
    cwd: session.cwd,
    status,
    exitCode: session.exitCode,
    exitSignal: session.exitSignal,
    exitReason: session.exitReason,
    ...(session.noOutputTimedOut !== void 0 ? { noOutputTimedOut: session.noOutputTimedOut } : {}),
    aggregated: session.aggregated,
    tail: session.tail,
    truncated: session.truncated,
    totalOutputChars: session.totalOutputChars,
  });
}
/** Returns the last `max` characters of text without adding ellipses. */
function tail(text, max = 2e3) {
  if (text.length <= max) return text;
  return sliceUtf16Safe(text, text.length - max);
}
function sumPendingChars(buffer) {
  let total = 0;
  for (const chunk of buffer) total += chunk.length;
  return total;
}
function capPendingBuffer(buffer, pendingCharsInput, cap) {
  let pendingChars = pendingCharsInput;
  if (pendingChars <= cap) return pendingChars;
  const last = buffer.at(-1);
  if (last && last.length >= cap) {
    buffer.length = 0;
    const kept = tail(last, cap);
    buffer.push(kept);
    return kept.length;
  }
  let dropCount = 0;
  while (dropCount < buffer.length) {
    const chunk = buffer[dropCount];
    if (chunk === void 0 || pendingChars - chunk.length < cap) break;
    pendingChars -= chunk.length;
    dropCount += 1;
  }
  if (dropCount > 0) buffer.splice(0, dropCount);
  if (buffer.length && pendingChars > cap) {
    const overflow = pendingChars - cap;
    const firstChunk = buffer.at(0);
    if (firstChunk !== void 0) {
      const trimmedChunk = sliceUtf16Safe(firstChunk, overflow);
      buffer[0] = trimmedChunk;
      pendingChars -= firstChunk.length - trimmedChunk.length;
    }
  }
  return pendingChars;
}
/** Keeps only the last `max` characters for bounded aggregate output storage. */
function trimWithCap(text, max) {
  return tail(text, max);
}
/** Lists backgrounded running sessions visible to reconnect/poll callers. */
function listRunningSessions() {
  return Array.from(runningSessions.values()).filter((s) => s.backgrounded);
}
/** Lists retained finished background sessions. */
function listFinishedSessions() {
  return Array.from(finishedSessions.values());
}
/** Overrides finished-session retention TTL, clamped to supported bounds. */
function setJobTtlMs(value) {
  if (value === void 0 || Number.isNaN(value)) return;
  jobTtlMs = clampTtl(value);
  stopSweeper();
  startSweeper();
}
function pruneFinishedSessions() {
  const cutoff = Date.now() - jobTtlMs;
  for (const [id, session] of finishedSessions.entries())
    if (session.endedAt < cutoff) finishedSessions.delete(id);
}
function startSweeper() {
  if (sweeper) return;
  sweeper = setInterval(pruneFinishedSessions, Math.max(3e4, jobTtlMs / 6));
  sweeper.unref?.();
}
function stopSweeper() {
  if (!sweeper) return;
  clearInterval(sweeper);
  sweeper = null;
}
//#endregion
export {
  drainSession as a,
  getSession as c,
  markBackgrounded as d,
  markExited as f,
  deleteSession as i,
  listFinishedSessions as l,
  tail as m,
  appendOutput as n,
  getActiveBackgroundExecSessionCount as o,
  setJobTtlMs as p,
  createSessionSlug as r,
  getFinishedSession as s,
  addSession as t,
  listRunningSessions as u,
};
