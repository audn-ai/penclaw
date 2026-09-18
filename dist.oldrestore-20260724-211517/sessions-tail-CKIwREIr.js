import fs from "node:fs";
import path from "node:path";
import "./parse-finite-number-Z7n6tXLk.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./regular-file-CBe_wA_B.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import {
  i as resolveTrajectoryFilePath,
  r as TRAJECTORY_RUNTIME_FILE_MAX_BYTES,
} from "./paths-Bo64bnX2.js";
import "./config-BDv-QbJ6.js";
import { r as resolveSessionFilePath } from "./paths-TfuVT-K8.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as readRegularFileSync } from "./regular-file-CuvhUtZS.js";
import { n as resolveTrajectoryRuntimeFile } from "./runtime-file-NaFGaXpk.js";
import { n as loadSqliteTrajectoryRuntimeEventRowsSync } from "./runtime-store.sqlite-BEvK2xDc.js";
import {
  Yt as resolveStoredSessionKeyForAgentStore,
  y as listSessionEntries,
} from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { r as readAcpSessionMeta } from "./session-meta-IQvNG5NK.js";
import { t as resolveSessionStoreTargetsOrExit } from "./session-store-targets-BFhc7IRB.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { t as shortenText } from "./text-format-B61TPv4i.js";
//#region src/commands/sessions-tail.ts
/**
 * Session trajectory tail command.
 *
 * It selects active or requested sessions, renders recent trajectory events,
 * and can follow append-only trajectory files across rotation/truncation.
 */
const DEFAULT_TAIL_COUNT = 80;
const SESSION_KEY_PAD = 30;
const EVENT_TYPE_PAD = 16;
const FOLLOW_INTERVAL_MS = 1e3;
function resolveFollowIntervalMs() {
  return FOLLOW_INTERVAL_MS;
}
function parseTailCount(value) {
  if (value === void 0) return DEFAULT_TAIL_COUNT;
  return parseStrictNonNegativeInteger(value) ?? null;
}
function toOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function isTrajectoryEvent(value) {
  return (
    isRecord(value) &&
    value.traceSchema === "openclaw-trajectory" &&
    value.schemaVersion === 1 &&
    typeof value.type === "string" &&
    typeof value.ts === "string" &&
    typeof value.sessionId === "string"
  );
}
function parseTrajectoryEventLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed);
    return isTrajectoryEvent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function parseTrajectoryEventLines(lines) {
  return lines.flatMap((line) => {
    const event = parseTrajectoryEventLine(line);
    return event ? [event] : [];
  });
}
function eventSequence(event) {
  const seq = event.sourceSeq ?? event.seq;
  return Number.isFinite(seq) ? seq : null;
}
function eventTimestampMs(event) {
  const parsed = Date.parse(event.ts);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
}
function eventCursor(event) {
  return {
    seq: eventSequence(event),
    tsMs: eventTimestampMs(event),
  };
}
function compareCursors(left, right) {
  if (left.seq !== null && right.seq !== null && left.seq !== right.seq)
    return left.seq - right.seq;
  const byTimestamp = left.tsMs - right.tsMs;
  if (byTimestamp !== 0) return byTimestamp;
  if (left.seq !== null && right.seq !== null) return left.seq - right.seq;
  return 0;
}
function maxCursorValue(current, candidate) {
  return !current || compareCursors(candidate, current) > 0 ? candidate : current;
}
function maxCursor(current, event) {
  return maxCursorValue(current, eventCursor(event));
}
function maxCursorFromEvents(events) {
  return events.reduce((cursor, event) => maxCursor(cursor, event), null);
}
function eventsAfterCursor(events, cursor) {
  if (!cursor) return events;
  return events.filter((event) => compareCursors(eventCursor(event), cursor) > 0);
}
function formatTimestamp(ts) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return "--:--:--";
  return date.toISOString().slice(11, 19);
}
function modelLabel(event) {
  const provider = event.provider?.trim();
  const model = event.modelId?.trim();
  if (provider && model) return `${provider}/${model}`;
  return model || provider || void 0;
}
function toolName(data) {
  return toOptionalString(data?.name) ?? toOptionalString(data?.toolName) ?? "tool";
}
function resultStatus(data) {
  if (data?.success === true) return "ok";
  if (data?.success === false || data?.isError === true) return "error";
  return toOptionalString(data?.status) ?? "done";
}
function modelCompletionStatus(data) {
  if (data?.timedOut === true) return "timeout";
  if (data?.aborted === true) return "aborted";
  if (toOptionalString(data?.promptError)) return "error";
  return "done";
}
function safePreview(event) {
  const data = event.data;
  switch (event.type) {
    case "session.started":
      return "session started";
    case "context.compiled": {
      const tools = Array.isArray(data?.tools) ? data.tools.length : void 0;
      return tools === void 0 ? "context compiled" : `context compiled (${tools} tools)`;
    }
    case "prompt.submitted":
      return "prompt submitted";
    case "prompt.skipped": {
      const reason = toOptionalString(data?.reason);
      return `prompt skipped${reason ? `: ${reason}` : ""}`;
    }
    case "tool.call":
      return `${toolName(data)} {...redacted...}`;
    case "tool.timeout":
      return `${toolName(data)} timeout`;
    case "tool.result":
      return `${toolName(data)} ${resultStatus(data)}`;
    case "model.completed": {
      const model = modelLabel(event);
      const status = modelCompletionStatus(data);
      return model ? `${model} ${status}` : status;
    }
    case "session.ended":
      return toOptionalString(data?.status) ?? "ended";
    case "trace.truncated":
      return "trajectory truncated";
    default:
      return toOptionalString(data?.status) ?? toOptionalString(data?.name) ?? "";
  }
}
function formatProgressLine(event) {
  const sessionLabel = shortenText(event.sessionKey ?? event.sessionId, SESSION_KEY_PAD).padEnd(
    SESSION_KEY_PAD,
  );
  const typeLabel = shortenText(event.type, EVENT_TYPE_PAD).padEnd(EVENT_TYPE_PAD);
  const preview = safePreview(event);
  return [formatTimestamp(event.ts), typeLabel, sessionLabel, preview].join(" ").trimEnd();
}
function readTrajectorySnapshot(filePath) {
  try {
    const { buffer, stat } = readRegularFileSync({
      filePath,
      maxBytes: TRAJECTORY_RUNTIME_FILE_MAX_BYTES,
    });
    const text = buffer.toString("utf8");
    return {
      events: parseTrajectoryEventLines(text.split(/\r?\n/u)),
      fileState: fileStateFromStat(stat),
      offset: Buffer.byteLength(text, "utf8"),
    };
  } catch (error) {
    if (error.code === "ENOENT")
      return {
        events: [],
        fileState: null,
        offset: 0,
      };
    throw error;
  }
}
function readSqliteTrajectorySnapshot(source) {
  const rows = loadSqliteTrajectoryRuntimeEventRowsSync({
    agentId: source.agentId,
    sessionId: source.sessionId,
    storePath: source.storePath,
  });
  return {
    events: rows.map((row) => row.event),
    fileState: null,
    maxStorageSeq: rows.at(-1)?.seq ?? -1,
    offset: 0,
  };
}
function readTailSnapshot(selection) {
  return selection.source.kind === "sqlite"
    ? readSqliteTrajectorySnapshot(selection.source)
    : readTrajectorySnapshot(selection.source.path);
}
function renderEvents(events, runtime) {
  let cursor = null;
  for (const event of events) {
    runtime.log(formatProgressLine(event));
    cursor = maxCursor(cursor, event);
  }
  return cursor;
}
function fileStateFromStat(stat) {
  return {
    dev: stat.dev,
    ino: stat.ino,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
  };
}
function sameFileIdentity(left, right) {
  return Boolean(left && left.dev === right.dev && left.ino === right.ino);
}
function readFollowFileState(filePath) {
  try {
    return fileStateFromStat(fs.statSync(filePath));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
function isRunningSession(selection) {
  const acpMeta = readAcpSessionMeta({
    sessionKey: resolveStoredSessionKeyForAgentStore({
      cfg: getRuntimeConfig(),
      agentId: selection.agentId,
      sessionKey: selection.key,
    }),
  });
  return selection.entry.status === "running" || acpMeta?.state === "running";
}
function compareSelectionsByUpdatedAt(a, b) {
  return (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0);
}
async function resolveTailTrajectoryPath(params) {
  return (
    (await resolveTrajectoryRuntimeFile({
      sessionFile: params.sessionFile,
      sessionId: params.sessionId,
    })) ??
    resolveTrajectoryFilePath({
      sessionFile: params.sessionFile,
      sessionId: params.sessionId,
    })
  );
}
async function buildTailSelection(params) {
  const sessionId = params.entry.sessionId?.trim();
  if (!sessionId) return null;
  const sessionsDir = path.dirname(params.storePath);
  let sessionFile;
  try {
    const entrySessionFile = params.entry.sessionFile?.trim();
    const marker = entrySessionFile ? parseSqliteSessionFileMarker(entrySessionFile) : null;
    if (marker && marker.sessionId === sessionId)
      return {
        agentId: params.agentId,
        entry: params.entry,
        key: params.key,
        source: {
          agentId: marker.agentId,
          kind: "sqlite",
          sessionId: marker.sessionId,
          storePath: marker.storePath,
        },
        storePath: params.storePath,
      };
    sessionFile = resolveSessionFilePath(sessionId, params.entry, {
      agentId: params.agentId,
      sessionsDir,
    });
  } catch {
    return null;
  }
  const trajectoryPath = await resolveTailTrajectoryPath({
    sessionFile,
    sessionId,
  });
  return {
    agentId: params.agentId,
    entry: params.entry,
    key: params.key,
    source: {
      kind: "file",
      path: trajectoryPath,
    },
    storePath: params.storePath,
  };
}
function selectSessionsToTail(selections, sessionKey) {
  const requested = sessionKey?.trim();
  if (requested) return selections.filter((selection) => selection.key === requested);
  const running = selections.filter((selection) => isRunningSession(selection));
  if (running.length > 0) return running.toSorted(compareSelectionsByUpdatedAt);
  const latest = selections.toSorted(compareSelectionsByUpdatedAt)[0];
  return latest ? [latest] : [];
}
function statFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch (error) {
    if (error.code === "ENOENT") return 0;
    throw error;
  }
}
function readNewFileFollowEvents(state) {
  const fileState = readFollowFileState(state.selection.source.path);
  if (!fileState) {
    state.fileState = null;
    state.offset = 0;
    state.pending = "";
    return [];
  }
  const replaced = !sameFileIdentity(state.fileState, fileState);
  const truncated = fileState.size < state.offset;
  const possiblyRewrittenSameSize =
    fileState.size === state.offset && state.fileState?.mtimeMs !== fileState.mtimeMs;
  if (replaced || truncated || possiblyRewrittenSameSize) {
    const snapshot = readTrajectorySnapshot(state.selection.source.path);
    state.fileState = snapshot.fileState;
    state.offset = snapshot.offset;
    state.pending = "";
    return eventsAfterCursor(snapshot.events, state.cursor);
  }
  if (fileState.size === state.offset) {
    state.fileState = fileState;
    return [];
  }
  const fd = fs.openSync(state.selection.source.path, "r");
  try {
    const deltaBytes = fileState.size - state.offset;
    if (deltaBytes > 52428800)
      throw new Error(
        `Trajectory delta exceeds ${TRAJECTORY_RUNTIME_FILE_MAX_BYTES} bytes: ${deltaBytes}`,
      );
    const buffer = Buffer.alloc(deltaBytes);
    fs.readSync(fd, buffer, 0, buffer.length, state.offset);
    state.offset = fileState.size;
    state.fileState = fileState;
    const lines = `${state.pending}${buffer.toString("utf8")}`.split(/\r?\n/u);
    state.pending = lines.pop() ?? "";
    return parseTrajectoryEventLines(lines);
  } finally {
    fs.closeSync(fd);
  }
}
function readNewSqliteFollowEvents(state) {
  const rows = loadSqliteTrajectoryRuntimeEventRowsSync({
    agentId: state.selection.source.agentId,
    afterSeq: state.lastStorageSeq,
    sessionId: state.selection.source.sessionId,
    storePath: state.selection.source.storePath,
  });
  if (rows.length === 0) return [];
  state.lastStorageSeq = rows.at(-1)?.seq ?? state.lastStorageSeq;
  return rows.map((row) => row.event);
}
function readNewFollowEvents(state) {
  return state.kind === "sqlite"
    ? readNewSqliteFollowEvents(state)
    : readNewFileFollowEvents(state);
}
function renderFollowEvents(events, state, runtime) {
  const cursor = renderEvents(events, runtime);
  if (cursor) state.cursor = maxCursorValue(state.cursor, cursor);
}
async function followSelections(selections, runtime, initialSnapshots) {
  const states = selections.map((selection) => {
    const snapshot = initialSnapshots.get(selection);
    if (selection.source.kind === "sqlite")
      return {
        cursor: snapshot ? maxCursorFromEvents(snapshot.events) : null,
        kind: "sqlite",
        lastStorageSeq: snapshot?.maxStorageSeq ?? -1,
        selection,
      };
    return {
      cursor: snapshot ? maxCursorFromEvents(snapshot.events) : null,
      fileState: snapshot?.fileState ?? readFollowFileState(selection.source.path),
      kind: "file",
      offset: snapshot?.offset ?? statFileSize(selection.source.path),
      pending: "",
      selection,
    };
  });
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      for (const state of states)
        try {
          renderFollowEvents(readNewFollowEvents(state), state, runtime);
        } catch (error) {
          runtime.error(
            `Failed to read trajectory progress for ${state.selection.key}: ${formatErrorMessage(error)}`,
          );
        }
    }, resolveFollowIntervalMs());
    const stop = () => {
      clearInterval(interval);
      process.off("SIGINT", stop);
      process.off("SIGTERM", stop);
      resolve();
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
}
function resolveTailTargetAgent(opts) {
  if (opts.agent?.trim() || opts.store?.trim() || opts.allAgents === true) return opts.agent;
  return opts.sessionKey?.trim() ? resolveAgentIdFromSessionKey(opts.sessionKey) : void 0;
}
/** Tails recent trajectory events for the selected session(s). */
async function sessionsTailCommand(opts, runtime) {
  const tailCount = parseTailCount(opts.tail);
  if (tailCount === null) {
    runtime.error("--tail must be a non-negative integer, for example --tail 25.");
    runtime.exit(1);
    return;
  }
  const targets = resolveSessionStoreTargetsOrExit({
    cfg: getRuntimeConfig(),
    opts: {
      store: opts.store,
      agent: resolveTailTargetAgent(opts),
      allAgents: opts.allAgents,
    },
    runtime,
  });
  if (!targets) return;
  const selections = [];
  for (const target of targets)
    for (const { sessionKey, entry } of listSessionEntries({
      agentId: target.agentId,
      storePath: target.storePath,
    })) {
      const selection = await buildTailSelection({
        agentId: target.agentId,
        entry,
        key: sessionKey,
        storePath: target.storePath,
      });
      if (selection) selections.push(selection);
    }
  const selected = selectSessionsToTail(selections, opts.sessionKey);
  if (selected.length === 0) {
    const suffix = opts.sessionKey ? ` for ${opts.sessionKey}` : "";
    runtime.log(`No sessions found${suffix}.`);
    return;
  }
  const followSnapshots = /* @__PURE__ */ new Map();
  for (const selection of selected) {
    const snapshot = readTailSnapshot(selection);
    followSnapshots.set(selection, snapshot);
    renderEvents(tailCount > 0 ? snapshot.events.slice(-tailCount) : [], runtime);
  }
  if (opts.follow) await followSelections(selected, runtime, followSnapshots);
}
//#endregion
export { sessionsTailCommand };
