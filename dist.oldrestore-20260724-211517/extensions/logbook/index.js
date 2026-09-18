import { createHash } from "node:crypto";
import { chmodSync, mkdirSync, readFileSync, rmSync, rmdirSync, writeFileSync } from "node:fs";
import "../../error-runtime-BIAwr399.js";
import { createRequire } from "node:module";
import path from "node:path";
import "../../gateway-runtime-IrTdjV5_.js";
import { n as errorShape, t as ErrorCodes } from "../../error-codes-O0AkRNx7.js";
import { r as formatErrorMessage } from "../../errors-BoHeli7m.js";
import { t as expectDefined } from "../../expect-runtime--WgnKYXT.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
//#region extensions/logbook/src/config.ts
const DEFAULTS = {
  captureEnabled: true,
  captureIntervalSeconds: 30,
  analysisIntervalMinutes: 15,
  screenIndex: 0,
  maxWidth: 1440,
  retentionDays: 14,
};
function clampNumber(value, fallback, min, max) {
  return Math.min(
    max,
    Math.max(
      min,
      Math.round(typeof value === "number" && Number.isFinite(value) ? value : fallback),
    ),
  );
}
function optionalString(value) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function resolveLogbookConfig(raw) {
  const value = raw && typeof raw === "object" ? raw : {};
  return {
    captureEnabled: value.captureEnabled !== false,
    captureIntervalSeconds: clampNumber(
      value.captureIntervalSeconds,
      DEFAULTS.captureIntervalSeconds,
      5,
      600,
    ),
    analysisIntervalMinutes: clampNumber(
      value.analysisIntervalMinutes,
      DEFAULTS.analysisIntervalMinutes,
      3,
      120,
    ),
    nodeId: optionalString(value.nodeId),
    screenIndex: clampNumber(value.screenIndex, DEFAULTS.screenIndex, 0, 16),
    maxWidth: clampNumber(value.maxWidth, DEFAULTS.maxWidth, 480, 3840),
    visionModel: optionalString(value.visionModel),
    retentionDays: clampNumber(value.retentionDays, DEFAULTS.retentionDays, 1, 365),
  };
}
/** Splits a "provider/model" ref; model ids may themselves contain slashes. */
function parseModelRef(ref) {
  const slash = ref.indexOf("/");
  if (slash <= 0 || slash === ref.length - 1) return null;
  return {
    provider: ref.slice(0, slash),
    model: ref.slice(slash + 1),
  };
}
//#endregion
//#region extensions/logbook/src/prompts.ts
const CARD_MIN_MINUTES = 10;
const CARD_MAX_MINUTES = 60;
const CARD_CATEGORIES = [
  "coding",
  "review",
  "writing",
  "research",
  "comms",
  "meetings",
  "design",
  "ops",
  "browsing",
  "media",
  "other",
];
function formatClock(ms) {
  const date = new Date(ms);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}
const OBSERVATION_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["segments"],
  properties: {
    segments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["start", "end", "description"],
        properties: {
          start: {
            type: "string",
            description: "HH:MM:SS within the covered window",
          },
          end: {
            type: "string",
            description: "HH:MM:SS within the covered window",
          },
          description: { type: "string" },
        },
      },
    },
  },
};
function buildObservationInstructions(params) {
  const start = formatClock(params.startMs);
  const end = formatClock(params.endMs);
  const times = params.frameTimes.map(formatClock).join(", ");
  return [
    `These are ${params.frameTimes.length} screenshots of one computer screen, captured in order between ${start} and ${end} (local time).`,
    `Capture timestamps: ${times}.`,
    "",
    "Write an activity log detailed enough that the user could reconstruct what they did.",
    'For each segment ask: "What EXACTLY did they do? What SPECIFIC things are visible?"',
    "Capture exact app/site names, file names, URLs, page or PR titles, usernames, search queries, and numbers when readable.",
    "",
    'Bad: "Checked email". Good: "Gmail: read \'Budget approval\' from dana@acme.com, replied briefly".',
    'Bad: "Working on code". Good: "VS Code: editing store.ts, fixing a type error in replaceCardsInWindow".',
    "",
    "Return 2-8 segments covering the whole window in order, no gaps, no overlaps.",
    "If the screen barely changes, return one segment describing the sustained activity.",
    "Group by GOAL, not app: debugging across editor, terminal, and browser is one segment.",
    `Timestamps must be HH:MM:SS between ${start} and ${end}.`,
  ].join("\n");
}
function buildCardsPrompt(params) {
  const transcript = params.observations
    .map((obs) => `[${formatClock(obs.startMs)} - ${formatClock(obs.endMs)}] ${obs.text}`)
    .join("\n");
  const previous = JSON.stringify(
    params.previousCards.map((card) => ({
      startTime: formatClock(card.startMs),
      endTime: formatClock(card.endMs),
      category: card.category,
      title: card.title,
      summary: card.summary,
      detailedSummary: card.detail,
      distractions: card.distractions.map((d) => ({
        startTime: formatClock(d.startMs),
        endTime: formatClock(d.endMs),
        title: d.title,
      })),
      appSites: {
        primary: card.appPrimary ?? "",
        secondary: card.appSecondary ?? "",
      },
    })),
    null,
    2,
  );
  return [
    "You are synthesizing a user's screen activity log into timeline cards. Each card is one coherent activity.",
    "",
    "CORE PRINCIPLE:",
    `Each card = one main thing the user did. Time is a constraint (${CARD_MIN_MINUTES}-${CARD_MAX_MINUTES} min per card), not a goal.`,
    "",
    "SPLIT into a new card only when the user's GOAL changes, not just the tool. MERGE when consecutive activities serve the same goal (app switches, debugging across editor + terminal + browser, iterating on the same document). Default to merging: fewer rich cards beat many granular ones.",
    "",
    "DISTRACTIONS: a brief (<5 min) unrelated interruption inside a card. Anything sustained (>10 min) is its own card.",
    "",
    "CONTINUITY: adjacent cards meet cleanly; never introduce gaps or overlaps. Preserve genuine idle gaps from the source data.",
    "",
    `CATEGORY: one of ${CARD_CATEGORIES.join(", ")}.`,
    "",
    'APP SITES: identify the main app or site per card as a canonical lower-case domain (figma.com, docs.google.com, github.com). Use "terminal" for terminals. Omit secondary when unclear. Never invent brands.',
    "",
    "REVISION CONTRACT:",
    "\"Previous cards\" is a draft you are revising and extending with the new observations. Your output must cover the union of the previous cards' time range and the new observations' range; you may restructure freely inside it, but do not drop covered time. The final card may be shorter than the minimum.",
    "",
    `Day: ${params.day}. Window under revision: ${formatClock(params.windowStartMs)} to ${formatClock(params.windowEndMs)}.`,
    "",
    "Previous cards:",
    previous,
    "",
    "New observations:",
    transcript || "(none)",
    "",
    "Return ONLY a raw JSON array, no code fences, in this exact shape:",
    `[
  {
    "startTime": "13:12:00",
    "endTime": "13:41:00",
    "category": "coding",
    "title": "",
    "summary": "",
    "detailedSummary": "",
    "distractions": [{ "startTime": "13:15:00", "endTime": "13:18:00", "title": "" }],
    "appSites": { "primary": "", "secondary": "" }
  }
]`,
  ].join("\n");
}
function buildCardsCorrectionPrompt(validationError) {
  return [
    "The previous JSON output failed validation:",
    validationError,
    "",
    "Return the FULL corrected JSON array (not a diff). Same coverage, no gaps or overlaps, JSON only.",
  ].join("\n");
}
function buildStandupPrompt(params) {
  const render = (cards) =>
    cards
      .map(
        (card) =>
          `- ${formatClock(card.startMs)}-${formatClock(card.endMs)} [${card.category}] ${card.title}: ${card.summary}`,
      )
      .join("\n") || "(no tracked activity)";
  return [
    `Write a concise daily standup for ${params.day} based on the user's tracked screen activity.`,
    "",
    "Yesterday's timeline:",
    render(params.previousDayCards),
    "",
    "Today's timeline so far:",
    render(params.cards),
    "",
    "Output markdown with exactly three sections: '## Done' (yesterday's concrete accomplishments, merged and deduplicated), '## Today' (in-progress threads worth continuing), '## Blockers' (only if evidence shows something stuck; otherwise write 'None observed').",
    "Keep it under 150 words. No preamble.",
  ].join("\n");
}
function buildAskPrompt(params) {
  const cards = params.cards
    .map(
      (card) =>
        `- ${formatClock(card.startMs)}-${formatClock(card.endMs)} [${card.category}] ${card.title}: ${card.summary} ${card.detail}`,
    )
    .join("\n");
  const observations = params.observations
    .map((obs) => `- ${formatClock(obs.startMs)}-${formatClock(obs.endMs)}: ${obs.text}`)
    .join("\n");
  return [
    `Answer the user's question about their tracked day (${params.day}) using ONLY the evidence below.`,
    "If the evidence does not contain the answer, say so plainly. Reference times like 14:05 when useful.",
    "",
    "Timeline cards:",
    cards || "(none)",
    "",
    "Detailed observations:",
    observations || "(none)",
    "",
    `Question: ${params.question}`,
    "",
    "Answer in 1-4 sentences.",
  ].join("\n");
}
//#endregion
//#region extensions/logbook/src/store.ts
function loadNodeSqlite() {
  return createRequire(import.meta.url)("node:sqlite");
}
const SCHEMA = `
CREATE TABLE IF NOT EXISTS frames (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  captured_at_ms INTEGER NOT NULL,
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  screen_index INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  byte_size INTEGER NOT NULL DEFAULT 0,
  content_hash TEXT NOT NULL,
  idle INTEGER NOT NULL DEFAULT 0,
  batch_id INTEGER
);
CREATE INDEX IF NOT EXISTS idx_logbook_frames_day ON frames (day, captured_at_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_frames_unbatched ON frames (batch_id) WHERE batch_id IS NULL;
CREATE TABLE IF NOT EXISTS batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  frame_count INTEGER NOT NULL DEFAULT 0,
  model TEXT,
  created_ms INTEGER NOT NULL,
  updated_ms INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_logbook_batches_day ON batches (day, start_ms);
CREATE TABLE IF NOT EXISTS observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id INTEGER NOT NULL,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  text TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_logbook_observations_day ON observations (day, start_ms);
CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  app_primary TEXT,
  app_secondary TEXT,
  distractions TEXT NOT NULL DEFAULT '[]',
  keyframe_id INTEGER,
  updated_ms INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_logbook_cards_day ON cards (day, start_ms);
CREATE TABLE IF NOT EXISTS standups (
  day TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  updated_ms INTEGER NOT NULL
);
`;
function toFrame(row) {
  return {
    id: row.id,
    capturedAtMs: row.captured_at_ms,
    day: row.day,
    path: row.path,
    screenIndex: row.screen_index,
    width: row.width ?? void 0,
    height: row.height ?? void 0,
    byteSize: row.byte_size,
    idle: row.idle === 1,
  };
}
function toBatch(row) {
  return {
    id: row.id,
    day: row.day,
    startMs: row.start_ms,
    endMs: row.end_ms,
    status: row.status,
    error: row.error ?? void 0,
    frameCount: row.frame_count,
    model: row.model ?? void 0,
  };
}
function parseDistractions$1(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry) =>
        entry !== null &&
        typeof entry === "object" &&
        typeof entry.title === "string" &&
        typeof entry.startMs === "number" &&
        typeof entry.endMs === "number",
    );
  } catch {
    return [];
  }
}
function toCard(row) {
  return {
    id: row.id,
    day: row.day,
    startMs: row.start_ms,
    endMs: row.end_ms,
    title: row.title,
    summary: row.summary,
    detail: row.detail,
    category: row.category,
    appPrimary: row.app_primary ?? void 0,
    appSecondary: row.app_secondary ?? void 0,
    distractions: parseDistractions$1(row.distractions),
    keyframeId: row.keyframe_id ?? void 0,
  };
}
/** Formats an epoch-ms timestamp as a local-time YYYY-MM-DD day key. */
function dayKeyFor(ms) {
  const date = new Date(ms);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
}
var LogbookStore = class {
  constructor(dataDir) {
    this.dataDir = dataDir;
    mkdirSync(dataDir, {
      recursive: true,
      mode: 448,
    });
    chmodSync(dataDir, 448);
    this.framesDir = path.join(dataDir, "frames");
    mkdirSync(this.framesDir, {
      recursive: true,
      mode: 448,
    });
    chmodSync(this.framesDir, 448);
    const { DatabaseSync } = loadNodeSqlite();
    const dbPath = path.join(dataDir, "logbook.sqlite");
    this.db = new DatabaseSync(dbPath);
    chmodSync(dbPath, 384);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec("PRAGMA busy_timeout = 1000");
    this.db.exec(SCHEMA);
  }
  close() {
    this.db.close();
  }
  frameFilePath(day, capturedAtMs) {
    return path.join(this.framesDir, day, `${capturedAtMs}.jpg`);
  }
  insertFrame(params) {
    const result = this.db
      .prepare(`INSERT INTO frames (captured_at_ms, day, path, screen_index, width, height, byte_size, content_hash, idle)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(
        params.capturedAtMs,
        params.day,
        params.path,
        params.screenIndex,
        params.width ?? null,
        params.height ?? null,
        params.byteSize,
        params.contentHash,
        params.idle ? 1 : 0,
      );
    return Number(result.lastInsertRowid);
  }
  lastFrame() {
    const row = this.db
      .prepare(
        `SELECT captured_at_ms, content_hash FROM frames ORDER BY captured_at_ms DESC LIMIT 1`,
      )
      .get();
    return row
      ? {
          capturedAtMs: row.captured_at_ms,
          contentHash: row.content_hash,
        }
      : null;
  }
  unbatchedActiveFrames(limit) {
    return this.db
      .prepare(`SELECT id, captured_at_ms, day, path, screen_index, width, height, byte_size, idle
         FROM frames WHERE batch_id IS NULL AND idle = 0
         ORDER BY captured_at_ms ASC LIMIT ?`)
      .all(limit)
      .map(toFrame);
  }
  countUnbatchedActiveFrames() {
    return this.db
      .prepare(`SELECT COUNT(*) AS n FROM frames WHERE batch_id IS NULL AND idle = 0`)
      .get().n;
  }
  frameById(id) {
    const row = this.db
      .prepare(`SELECT id, captured_at_ms, day, path, screen_index, width, height, byte_size, idle
         FROM frames WHERE id = ?`)
      .get(id);
    return row ? toFrame(row) : null;
  }
  framesInRange(startMs, endMs) {
    return this.db
      .prepare(`SELECT id, captured_at_ms, day, path, screen_index, width, height, byte_size, idle
         FROM frames WHERE captured_at_ms >= ? AND captured_at_ms < ?
         ORDER BY captured_at_ms ASC`)
      .all(startMs, endMs)
      .map(toFrame);
  }
  createBatch(params) {
    const now = Date.now();
    const result = this.db
      .prepare(`INSERT INTO batches (day, start_ms, end_ms, status, frame_count, created_ms, updated_ms)
         VALUES (?, ?, ?, 'pending', ?, ?, ?)`)
      .run(params.day, params.startMs, params.endMs, params.frameIds.length, now, now);
    const batchId = Number(result.lastInsertRowid);
    const assign = this.db.prepare(`UPDATE frames SET batch_id = ? WHERE id = ?`);
    for (const frameId of params.frameIds) assign.run(batchId, frameId);
    return batchId;
  }
  setBatchStatus(batchId, status, error, model) {
    this.db
      .prepare(
        `UPDATE batches SET status = ?, error = ?, model = COALESCE(?, model), updated_ms = ? WHERE id = ?`,
      )
      .run(status, error ?? null, model ?? null, Date.now(), batchId);
  }
  latestBatch() {
    const row = this.db
      .prepare(`SELECT id, day, start_ms, end_ms, status, error, frame_count, model
         FROM batches ORDER BY id DESC LIMIT 1`)
      .get();
    return row ? toBatch(row) : null;
  }
  /** Requeues batches stuck in `running` after a crash so frames are not orphaned. */
  resetRunningBatches() {
    this.db
      .prepare(`UPDATE batches SET status = 'pending', updated_ms = ? WHERE status = 'running'`)
      .run(Date.now());
  }
  /** Requeues failed batches for an explicit user-driven retry (analyze now). */
  resetErrorBatches() {
    const result = this.db
      .prepare(
        `UPDATE batches SET status = 'pending', error = NULL, updated_ms = ? WHERE status = 'error'`,
      )
      .run(Date.now());
    return Number(result.changes);
  }
  nextPendingBatch() {
    const row = this.db
      .prepare(`SELECT id, day, start_ms, end_ms, status, error, frame_count, model
         FROM batches WHERE status = 'pending' ORDER BY start_ms ASC LIMIT 1`)
      .get();
    return row ? toBatch(row) : null;
  }
  batchFrames(batchId) {
    return this.db
      .prepare(`SELECT id, captured_at_ms, day, path, screen_index, width, height, byte_size, idle
         FROM frames WHERE batch_id = ? ORDER BY captured_at_ms ASC`)
      .all(batchId)
      .map(toFrame);
  }
  /**
   * Replaces a batch's observations atomically. Batch retries (analyze now
   * after an error) rerun the vision stage, so appending would duplicate
   * evidence into card synthesis, standups, and ask answers.
   */
  replaceObservations(batchId, day, segments) {
    this.db.exec("BEGIN");
    try {
      this.db.prepare(`DELETE FROM observations WHERE batch_id = ?`).run(batchId);
      const insert = this.db.prepare(
        `INSERT INTO observations (batch_id, day, start_ms, end_ms, text) VALUES (?, ?, ?, ?, ?)`,
      );
      for (const segment of segments)
        insert.run(batchId, day, segment.startMs, segment.endMs, segment.text);
      this.db.exec("COMMIT");
    } catch (err) {
      this.db.exec("ROLLBACK");
      throw err;
    }
  }
  observationsInRange(day, startMs, endMs) {
    return this.db
      .prepare(`SELECT id, batch_id, day, start_ms, end_ms, text FROM observations
         WHERE day = ? AND end_ms > ? AND start_ms < ? ORDER BY start_ms ASC`)
      .all(day, startMs, endMs)
      .map((row) => ({
        id: row.id,
        batchId: row.batch_id,
        day: row.day,
        startMs: row.start_ms,
        endMs: row.end_ms,
        text: row.text,
      }));
  }
  cardsForDay(day) {
    return this.db
      .prepare(`SELECT id, day, start_ms, end_ms, title, summary, detail, category, app_primary, app_secondary, distractions, keyframe_id
         FROM cards WHERE day = ? ORDER BY start_ms ASC`)
      .all(day)
      .map(toCard);
  }
  cardById(id) {
    const row = this.db
      .prepare(`SELECT id, day, start_ms, end_ms, title, summary, detail, category, app_primary, app_secondary, distractions, keyframe_id
         FROM cards WHERE id = ?`)
      .get(id);
    return row ? toCard(row) : null;
  }
  /**
   * Replaces cards overlapping [startMs, endMs) for a day in one transaction.
   * The analysis lookback treats recent cards as a revisable draft, so partial
   * writes here would surface as duplicated or missing timeline segments.
   */
  replaceCardsInWindow(day, startMs, endMs, drafts) {
    const now = Date.now();
    this.db.exec("BEGIN");
    try {
      this.db
        .prepare(`DELETE FROM cards WHERE day = ? AND end_ms > ? AND start_ms < ?`)
        .run(day, startMs, endMs);
      const insert = this.db
        .prepare(`INSERT INTO cards (day, start_ms, end_ms, title, summary, detail, category, app_primary, app_secondary, distractions, keyframe_id, updated_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      for (const draft of drafts)
        insert.run(
          draft.day,
          draft.startMs,
          draft.endMs,
          draft.title,
          draft.summary,
          draft.detail,
          draft.category,
          draft.appPrimary ?? null,
          draft.appSecondary ?? null,
          JSON.stringify(draft.distractions),
          draft.keyframeId ?? null,
          now,
        );
      this.db.exec("COMMIT");
    } catch (err) {
      this.db.exec("ROLLBACK");
      throw err;
    }
  }
  listDays() {
    return this.db
      .prepare(`SELECT day, COUNT(*) AS cards, MIN(start_ms) AS first_ms, MAX(end_ms) AS last_ms
         FROM cards GROUP BY day ORDER BY day DESC`)
      .all()
      .map((row) => ({
        day: row.day,
        cards: row.cards,
        firstMs: row.first_ms,
        lastMs: row.last_ms,
      }));
  }
  dayStats(day) {
    const cards = this.cardsForDay(day);
    const categories = /* @__PURE__ */ new Map();
    const apps = /* @__PURE__ */ new Map();
    let trackedMs = 0;
    let distractionMs = 0;
    for (const card of cards) {
      const duration = Math.max(0, card.endMs - card.startMs);
      trackedMs += duration;
      categories.set(card.category, (categories.get(card.category) ?? 0) + duration);
      if (card.appPrimary) apps.set(card.appPrimary, (apps.get(card.appPrimary) ?? 0) + duration);
      for (const distraction of card.distractions)
        distractionMs += Math.max(0, distraction.endMs - distraction.startMs);
    }
    const byMsDesc = (a, b) => b.ms - a.ms;
    return {
      trackedMs,
      distractionMs,
      categories: [...categories.entries()]
        .map(([category, ms]) => ({
          category,
          ms,
        }))
        .toSorted(byMsDesc),
      apps: [...apps.entries()]
        .map(([domain, ms]) => ({
          domain,
          ms,
        }))
        .toSorted(byMsDesc),
    };
  }
  getStandup(day) {
    const row = this.db
      .prepare(`SELECT day, text, updated_ms FROM standups WHERE day = ?`)
      .get(day);
    return row
      ? {
          day: row.day,
          text: row.text,
          updatedMs: row.updated_ms,
        }
      : null;
  }
  saveStandup(day, text) {
    this.db
      .prepare(`INSERT INTO standups (day, text, updated_ms) VALUES (?, ?, ?)
         ON CONFLICT(day) DO UPDATE SET text = excluded.text, updated_ms = excluded.updated_ms`)
      .run(day, text, Date.now());
  }
  /** Deletes frame rows and files older than the retention window. */
  pruneFrames(olderThanMs) {
    const rows = this.db
      .prepare(`SELECT id, path, day FROM frames WHERE captured_at_ms < ?`)
      .all(olderThanMs);
    if (rows.length === 0) return 0;
    const days = /* @__PURE__ */ new Set();
    for (const row of rows) {
      rmSync(row.path, { force: true });
      days.add(row.day);
    }
    this.db
      .prepare(`UPDATE cards SET keyframe_id = NULL
         WHERE keyframe_id IN (SELECT id FROM frames WHERE captured_at_ms < ?)`)
      .run(olderThanMs);
    this.db.prepare(`DELETE FROM frames WHERE captured_at_ms < ?`).run(olderThanMs);
    for (const day of days)
      try {
        rmdirSync(path.join(this.framesDir, day));
      } catch {}
    return rows.length;
  }
};
//#endregion
//#region extensions/logbook/src/analyze.ts
/** Cards within this window before a batch are treated as a revisable draft. */
const CARD_LOOKBACK_MS = 2700 * 1e3;
/** Frame gap that splits one analysis window into separate batches. */
const BATCH_MAX_GAP_MS = 120 * 1e3;
/** Parses "HH:MM:SS" (or "H:MM", with optional am/pm) on a local day into epoch ms. */
function clockToMs(day, clock) {
  const match = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?\s*$/i.exec(clock);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? "0");
  const meridiem = match[4]?.toLowerCase();
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  const dayMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!dayMatch) return null;
  const year = Number(dayMatch[1]);
  const monthIndex = Number(dayMatch[2]) - 1;
  const dayOfMonth = Number(dayMatch[3]);
  const date = new Date(year, monthIndex, dayOfMonth, hours, minutes, seconds);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== dayOfMonth ||
    date.getHours() !== hours ||
    date.getMinutes() !== minutes ||
    date.getSeconds() !== seconds
  )
    return null;
  return date.getTime();
}
/** Strips code fences and extracts the outermost JSON array/object from model text. */
function extractJsonPayload(raw) {
  const cleaned = raw.replaceAll("```json", "").replaceAll("```", "").trim();
  const firstBracket = cleaned.search(/[[{]/);
  if (firstBracket < 0) return cleaned;
  const close = cleaned[firstBracket] === "[" ? "]" : "}";
  const lastClose = cleaned.lastIndexOf(close);
  if (lastClose > firstBracket) return cleaned.slice(firstBracket, lastClose + 1);
  return cleaned;
}
function parseObservationSegments(params) {
  let parsed;
  try {
    parsed = JSON.parse(extractJsonPayload(params.raw));
  } catch {
    return [];
  }
  const list = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray(parsed.segments)
      ? parsed.segments
      : [];
  const segments = [];
  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry;
    const description = typeof record.description === "string" ? record.description.trim() : "";
    const startMs = typeof record.start === "string" ? clockToMs(params.day, record.start) : null;
    const endMs = typeof record.end === "string" ? clockToMs(params.day, record.end) : null;
    if (!description || startMs === null || endMs === null) continue;
    const clampedStart = Math.max(params.startMs, Math.min(startMs, params.endMs));
    const clampedEnd = Math.max(clampedStart, Math.min(endMs, params.endMs));
    segments.push({
      startMs: clampedStart,
      endMs: clampedEnd,
      text: description,
    });
  }
  return segments.toSorted((a, b) => a.startMs - b.startMs);
}
function normalizeCategory(value) {
  const category = typeof value === "string" ? value.trim().toLowerCase() : "";
  return CARD_CATEGORIES.includes(category) ? category : "other";
}
function normalizeDomain(value) {
  if (typeof value !== "string") return;
  const domain = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split(/[/?#]/)[0];
  return domain && domain.length <= 100 ? domain : void 0;
}
function parseDistractions(day, value) {
  if (!Array.isArray(value)) return [];
  const distractions = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry;
    const startMs = typeof record.startTime === "string" ? clockToMs(day, record.startTime) : null;
    const endMs = typeof record.endTime === "string" ? clockToMs(day, record.endTime) : null;
    const title = typeof record.title === "string" ? record.title.trim() : "";
    if (startMs === null || endMs === null || !title || endMs <= startMs) continue;
    distractions.push({
      startMs,
      endMs,
      title,
    });
  }
  return distractions;
}
function parseCardsJson(params) {
  let parsed;
  try {
    parsed = JSON.parse(extractJsonPayload(params.raw));
  } catch (err) {
    return {
      ok: false,
      error: `Output is not valid JSON: ${err.message}`,
    };
  }
  if (!Array.isArray(parsed))
    return {
      ok: false,
      error: "Output must be a JSON array of cards.",
    };
  const drafts = [];
  const problems = [];
  parsed.forEach((entry, index) => {
    if (!entry || typeof entry !== "object") {
      problems.push(`Card ${index}: not an object.`);
      return;
    }
    const raw = entry;
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const summary = typeof raw.summary === "string" ? raw.summary.trim() : "";
    const startMs = typeof raw.startTime === "string" ? clockToMs(params.day, raw.startTime) : null;
    const endMs = typeof raw.endTime === "string" ? clockToMs(params.day, raw.endTime) : null;
    if (startMs === null || endMs === null) {
      problems.push(`Card ${index}: startTime/endTime must be HH:MM:SS local time.`);
      return;
    }
    if (endMs <= startMs) {
      problems.push(`Card ${index}: endTime must be after startTime.`);
      return;
    }
    if (!title || !summary) {
      problems.push(`Card ${index}: title and summary are required.`);
      return;
    }
    const appSites = raw.appSites && typeof raw.appSites === "object" ? raw.appSites : {};
    drafts.push({
      day: params.day,
      startMs,
      endMs,
      title,
      summary,
      detail: typeof raw.detailedSummary === "string" ? raw.detailedSummary.trim() : "",
      category: normalizeCategory(raw.category),
      appPrimary: normalizeDomain(appSites.primary),
      appSecondary: normalizeDomain(appSites.secondary),
      distractions: parseDistractions(params.day, raw.distractions),
      keyframeId: void 0,
    });
  });
  if (problems.length > 0)
    return {
      ok: false,
      error: problems.join("\n"),
    };
  if (drafts.length === 0)
    return {
      ok: false,
      error: "Output contained no valid cards.",
    };
  const sorted = drafts.toSorted((a, b) => a.startMs - b.startMs);
  const normalized = [];
  for (const current of sorted) {
    const previous = normalized.at(-1);
    if (!previous) {
      normalized.push(current);
      continue;
    }
    const overlapMs = previous.endMs - current.startMs;
    if (overlapMs > 60 * 1e3)
      return {
        ok: false,
        error: `Cards ${normalized.length - 1} and ${normalized.length} overlap by ${Math.round(overlapMs / 6e4)} minutes; adjacent cards must meet cleanly.`,
      };
    if (overlapMs > 0)
      normalized.push({
        ...current,
        startMs: previous.endMs,
      });
    else normalized.push(current);
  }
  return {
    ok: true,
    drafts: normalized,
  };
}
/** Sub-minute slack so minute-rounded model times do not fail coverage checks. */
const COVERAGE_TOLERANCE_MS = 120 * 1e3;
function formatClockForError(ms) {
  const date = new Date(ms);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
/**
 * Validates that drafts cover every required span before the destructive
 * window replacement. Without this, a syntactically valid but partial model
 * output would silently erase previously synthesized cards.
 */
function validateCardCoverage(params) {
  const tolerance = params.toleranceMs ?? COVERAGE_TOLERANCE_MS;
  const problems = [];
  for (const draft of params.drafts)
    if (
      draft.startMs < params.windowStartMs - tolerance ||
      draft.endMs > params.windowEndMs + tolerance
    )
      problems.push(
        `Card ${formatClockForError(draft.startMs)}-${formatClockForError(draft.endMs)} lies outside the revision window ${formatClockForError(params.windowStartMs)}-${formatClockForError(params.windowEndMs)}.`,
      );
  const covered = params.drafts
    .map((draft) => ({
      startMs: draft.startMs,
      endMs: draft.endMs,
    }))
    .toSorted((a, b) => a.startMs - b.startMs);
  for (const span of params.requiredSpans) {
    let cursor = span.startMs;
    for (const interval of covered) {
      if (interval.endMs <= cursor) continue;
      if (interval.startMs > cursor + tolerance) break;
      cursor = Math.max(cursor, interval.endMs);
      if (cursor >= span.endMs - tolerance) break;
    }
    if (cursor < span.endMs - tolerance)
      problems.push(
        `Time ${formatClockForError(Math.max(cursor, span.startMs))}-${formatClockForError(span.endMs)} from the previous timeline is not covered; do not drop existing cards or observed time.`,
      );
  }
  if (problems.length > 0)
    return {
      ok: false,
      error: problems.join("\n"),
    };
  return { ok: true };
}
/** Union of the revision window: previous draft cards plus the new batch range. */
function revisionWindow(params) {
  let startMs = params.batchStartMs;
  let endMs = params.batchEndMs;
  for (const card of params.previousCards) {
    startMs = Math.min(startMs, card.startMs);
    endMs = Math.max(endMs, card.endMs);
  }
  return {
    startMs,
    endMs,
  };
}
/** Groups pending frames into one batch window, splitting on large gaps. */
function selectBatchFrames(params) {
  if (params.frames.length === 0) return null;
  const first = expectDefined(params.frames[0], "first pending Logbook frame");
  const firstDay = dayKeyFor(first.capturedAtMs);
  const nextDayStart = new Date(first.capturedAtMs);
  nextDayStart.setHours(24, 0, 0, 0);
  const windowEnd = Math.min(first.capturedAtMs + params.windowMs, nextDayStart.getTime());
  const selected = [];
  let previousTs = first.capturedAtMs;
  let endedEarly = false;
  for (const frame of params.frames) {
    if (frame.capturedAtMs >= windowEnd) {
      endedEarly = dayKeyFor(frame.capturedAtMs) !== firstDay;
      break;
    }
    if (selected.length > 0 && frame.capturedAtMs - previousTs > BATCH_MAX_GAP_MS) {
      endedEarly = true;
      break;
    }
    if (selected.length > 0 && dayKeyFor(frame.capturedAtMs) !== firstDay) {
      endedEarly = true;
      break;
    }
    selected.push(frame);
    previousTs = frame.capturedAtMs;
  }
  if (selected.length === 0) return null;
  const last = expectDefined(selected.at(-1), "last selected Logbook frame");
  const windowElapsed = params.nowMs >= windowEnd;
  if (!windowElapsed && !endedEarly && !params.force) return null;
  const endMs = windowElapsed && !endedEarly ? windowEnd : last.capturedAtMs + 1;
  return {
    frameIds: selected.map((frame) => frame.id),
    startMs: first.capturedAtMs,
    endMs,
  };
}
/** Evenly samples frames so a batch stays within the per-call image budget. */
function sampleFrames(frames, max) {
  if (max <= 0) return [];
  if (frames.length <= max) return frames;
  if (max === 1) return [expectDefined(frames[0], "first Logbook frame sample")];
  const sampled = [];
  const step = (frames.length - 1) / (max - 1);
  for (let i = 0; i < max; i += 1)
    sampled.push(expectDefined(frames[Math.round(i * step)], "sampled Logbook frame"));
  return [...new Set(sampled)];
}
/** Picks the frame closest to a card's midpoint as its keyframe. */
function pickKeyframeId(card, frames) {
  if (frames.length === 0) return;
  const midpoint = card.startMs + (card.endMs - card.startMs) / 2;
  let best = expectDefined(frames[0], "first Logbook keyframe candidate");
  for (const frame of frames)
    if (Math.abs(frame.capturedAtMs - midpoint) < Math.abs(best.capturedAtMs - midpoint))
      best = frame;
  return best.id;
}
//#endregion
//#region extensions/logbook/src/service.ts
const ANALYSIS_TICK_MS = 60 * 1e3;
const PRUNE_TICK_MS = 3600 * 1e3;
const MODEL_MISSING_MESSAGE =
  "no vision model: set plugins.entries.logbook.config.visionModel or configure tools.media";
const MODEL_MISSING_LOG_INTERVAL_MS = 600 * 1e3;
const CAPTURE_FAILURE_PAUSE_TICKS = 10;
const CAPTURE_FAILURE_THRESHOLD = 3;
const JPEG_QUALITY = 0.6;
const STRUCTURED_MEDIA_PROVIDER = "codex";
/** node.invoke responses wrap the node result in {payload, payloadJSON}. */
function unwrapInvokePayload(raw) {
  if (!raw || typeof raw !== "object") return null;
  const envelope = raw;
  if (envelope.payload && typeof envelope.payload === "object") return envelope.payload;
  if (typeof envelope.payloadJSON === "string" && envelope.payloadJSON.length > 0)
    try {
      return JSON.parse(envelope.payloadJSON);
    } catch {
      return null;
    }
  return "base64" in envelope || "error" in envelope ? envelope : null;
}
/** Capture commands in preference order: app nodes first, headless node hosts second. */
const CAPTURE_COMMANDS = ["screen.snapshot", "logbook.snapshot"];
var LogbookService = class {
  constructor(config, deps) {
    this.config = config;
    this.deps = deps;
    this.store = null;
    this.captureTimer = null;
    this.analysisTimer = null;
    this.pruneTimer = null;
    this.captureInFlight = false;
    this.analysisInFlight = false;
    this.capturePaused = false;
    this.captureFailures = 0;
    this.captureBackoffTicks = 0;
    this.lastModelMissingLogMs = 0;
    this.cachedNode = null;
    this.failedNodeIds = /* @__PURE__ */ new Set();
  }
  start() {
    this.store = new LogbookStore(this.deps.dataDir);
    this.store.resetRunningBatches();
    this.captureTimer = setInterval(() => {
      this.captureTick();
    }, this.config.captureIntervalSeconds * 1e3);
    this.captureTimer.unref?.();
    this.analysisTimer = setInterval(() => {
      this.analysisTick();
    }, ANALYSIS_TICK_MS);
    this.analysisTimer.unref?.();
    this.pruneTimer = setInterval(() => {
      this.prune();
    }, PRUNE_TICK_MS);
    this.pruneTimer.unref?.();
    this.prune();
    this.deps.logger.info(
      `logbook: started (capture every ${this.config.captureIntervalSeconds}s, analysis window ${this.config.analysisIntervalMinutes}m, data ${this.deps.dataDir})`,
    );
  }
  stop() {
    for (const timer of [this.captureTimer, this.analysisTimer, this.pruneTimer])
      if (timer) clearInterval(timer);
    this.captureTimer = null;
    this.analysisTimer = null;
    this.pruneTimer = null;
    this.store?.close();
    this.store = null;
  }
  requireStore() {
    if (!this.store) throw new Error("Logbook service is not running");
    return this.store;
  }
  setCapturePaused(paused) {
    this.capturePaused = paused;
    if (!paused) {
      this.captureBackoffTicks = 0;
      this.captureFailures = 0;
    }
  }
  async resolveNode() {
    if (this.cachedNode) return { node: this.cachedNode };
    const { nodes } = await this.deps.runtime.nodes.list({ connected: true });
    const captureCommand = (node) =>
      CAPTURE_COMMANDS.find((command) => (node.commands ?? []).includes(command));
    const commandRank = (node) => CAPTURE_COMMANDS.indexOf(captureCommand(node));
    const candidates = nodes
      .filter((node) => captureCommand(node) !== void 0)
      .toSorted((a, b) => commandRank(a) - commandRank(b) || a.nodeId.localeCompare(b.nodeId));
    const wanted = this.config.nodeId?.toLowerCase();
    let pool = candidates.filter((node) => !this.failedNodeIds.has(node.nodeId));
    if (pool.length === 0) {
      this.failedNodeIds.clear();
      pool = candidates;
    }
    const picked = wanted
      ? candidates.find(
          (node) =>
            node.nodeId.toLowerCase() === wanted || node.displayName?.toLowerCase() === wanted,
        )
      : pool[0];
    const command = picked ? captureCommand(picked) : void 0;
    if (!picked || !command) {
      const inventory =
        nodes
          .map(
            (node) =>
              `${node.displayName ?? node.nodeId}(${(node.commands ?? []).join("/") || "no commands"})`,
          )
          .join(", ") || "none";
      return {
        reason: `no connected node exposes ${CAPTURE_COMMANDS.join(" or ")}; connected: ${inventory}`,
      };
    }
    this.cachedNode = {
      nodeId: picked.nodeId,
      displayName: picked.displayName,
      command,
    };
    return { node: this.cachedNode };
  }
  async captureTick() {
    if (!this.config.captureEnabled || this.capturePaused || this.captureInFlight || !this.store)
      return;
    if (this.captureBackoffTicks > 0) {
      this.captureBackoffTicks -= 1;
      return;
    }
    this.captureInFlight = true;
    try {
      const resolved = await this.resolveNode();
      if ("reason" in resolved) {
        if (this.lastCaptureError !== resolved.reason)
          this.deps.logger.warn(`logbook: ${resolved.reason}`);
        this.lastCaptureError = resolved.reason;
        return;
      }
      const node = resolved.node;
      const raw = unwrapInvokePayload(
        await this.deps.runtime.nodes.invoke({
          nodeId: node.nodeId,
          command: node.command,
          params: {
            screenIndex: this.config.screenIndex,
            maxWidth: this.config.maxWidth,
            quality: JPEG_QUALITY,
            format: "jpeg",
          },
          timeoutMs: 3e4,
        }),
      );
      if (raw?.error) throw new Error(raw.error);
      const base64 = raw?.base64;
      if (!base64) throw new Error(`${node.command} returned no image payload`);
      const buffer = Buffer.from(base64, "base64");
      const capturedAtMs = Date.now();
      const day = dayKeyFor(capturedAtMs);
      const contentHash = createHash("sha256").update(buffer).digest("hex");
      const idle = this.store.lastFrame()?.contentHash === contentHash;
      const filePath = this.store.frameFilePath(day, capturedAtMs);
      mkdirSync(path.dirname(filePath), {
        recursive: true,
        mode: 448,
      });
      writeFileSync(filePath, buffer, { mode: 384 });
      this.store.insertFrame({
        capturedAtMs,
        day,
        path: filePath,
        screenIndex: this.config.screenIndex,
        width: raw?.width,
        height: raw?.height,
        byteSize: buffer.byteLength,
        contentHash,
        idle,
      });
      this.lastCaptureAtMs = capturedAtMs;
      this.lastCaptureError = void 0;
      this.captureFailures = 0;
      this.failedNodeIds.clear();
    } catch (err) {
      this.captureFailures += 1;
      if (this.cachedNode) this.failedNodeIds.add(this.cachedNode.nodeId);
      this.cachedNode = null;
      this.lastCaptureError = err instanceof Error ? err.message : String(err);
      if (this.captureFailures >= CAPTURE_FAILURE_THRESHOLD) {
        this.captureBackoffTicks = CAPTURE_FAILURE_PAUSE_TICKS;
        this.deps.logger.warn(
          `logbook: capture failing (${this.lastCaptureError}); backing off for ${CAPTURE_FAILURE_PAUSE_TICKS} ticks`,
        );
      }
    } finally {
      this.captureInFlight = false;
    }
  }
  resolveVisionModel() {
    if (this.config.visionModel) {
      const ref = parseModelRef(this.config.visionModel);
      return ref
        ? {
            ref,
            source: "config",
          }
        : { source: "missing" };
    }
    const media = this.deps.fullConfig.tools?.media;
    if (media?.image?.enabled === false) return { source: "missing" };
    const entries = [...(media?.image?.models ?? []), ...(media?.models ?? [])];
    for (const entry of entries)
      if (
        entry.type !== "cli" &&
        entry.provider?.trim().toLowerCase() === STRUCTURED_MEDIA_PROVIDER &&
        typeof entry.model === "string" &&
        (!entry.capabilities || entry.capabilities.includes("image"))
      )
        return {
          ref: {
            provider: STRUCTURED_MEDIA_PROVIDER,
            model: entry.model,
            profile: entry.profile,
            preferredProfile: entry.preferredProfile,
          },
          source: "media-defaults",
        };
    return { source: "missing" };
  }
  async analyzeNow() {
    const store = this.requireStore();
    if (this.analysisInFlight)
      return {
        started: false,
        reason: "analysis already running",
      };
    if (!this.resolveVisionModel().ref)
      return {
        started: false,
        reason: MODEL_MISSING_MESSAGE,
      };
    store.resetErrorBatches();
    if (!store.nextPendingBatch()) {
      const selection = selectBatchFrames({
        frames: store.unbatchedActiveFrames(2e3),
        windowMs: this.config.analysisIntervalMinutes * 6e4,
        nowMs: Date.now(),
        force: true,
      });
      if (!selection)
        return {
          started: false,
          reason: "no unanalyzed activity captured yet",
        };
      store.createBatch({
        day: dayKeyFor(selection.startMs),
        startMs: selection.startMs,
        endMs: selection.endMs,
        frameIds: selection.frameIds,
      });
    }
    this.analysisTick();
    return { started: true };
  }
  async analysisTick() {
    if (this.analysisInFlight || !this.store) return;
    if (!this.resolveVisionModel().ref) {
      const now = Date.now();
      if (now - this.lastModelMissingLogMs > MODEL_MISSING_LOG_INTERVAL_MS) {
        this.lastModelMissingLogMs = now;
        this.deps.logger.warn(`logbook: analysis paused; ${MODEL_MISSING_MESSAGE}`);
      }
      return;
    }
    this.analysisInFlight = true;
    try {
      this.enqueueElapsedWindow();
      for (let i = 0; i < 4; i += 1) {
        const batch = this.store.nextPendingBatch();
        if (!batch) return;
        await this.runBatch(batch);
      }
    } catch (err) {
      this.deps.logger.error(`logbook: analysis tick failed: ${String(err)}`);
    } finally {
      this.analysisInFlight = false;
    }
  }
  enqueueElapsedWindow() {
    const store = this.requireStore();
    while (true) {
      const selection = selectBatchFrames({
        frames: store.unbatchedActiveFrames(2e3),
        windowMs: this.config.analysisIntervalMinutes * 6e4,
        nowMs: Date.now(),
      });
      if (!selection) return;
      store.createBatch({
        day: dayKeyFor(selection.startMs),
        startMs: selection.startMs,
        endMs: selection.endMs,
        frameIds: selection.frameIds,
      });
    }
  }
  async runBatch(batch) {
    const store = this.requireStore();
    const vision = this.resolveVisionModel();
    if (!vision.ref) return;
    store.setBatchStatus(batch.id, "running", void 0, `${vision.ref.provider}/${vision.ref.model}`);
    try {
      const sampled = sampleFrames(store.batchFrames(batch.id), 16);
      const images = sampled.map((frame) => ({
        type: "image",
        buffer: readFileSync(frame.path),
        fileName: path.basename(frame.path),
        mime: "image/jpeg",
      }));
      const segments = parseObservationSegments({
        raw:
          (
            await this.deps.runtime.mediaUnderstanding.extractStructuredWithModel({
              provider: vision.ref.provider,
              model: vision.ref.model,
              profile: vision.ref.profile,
              preferredProfile: vision.ref.preferredProfile,
              input: images,
              instructions: buildObservationInstructions({
                frameTimes: sampled.map((frame) => frame.capturedAtMs),
                startMs: batch.startMs,
                endMs: batch.endMs,
              }),
              schemaName: "logbook.observations",
              jsonSchema: OBSERVATION_JSON_SCHEMA,
              cfg: this.deps.fullConfig,
              timeoutMs: 18e4,
            })
          ).text ?? "",
        day: batch.day,
        startMs: batch.startMs,
        endMs: batch.endMs,
      });
      if (segments.length === 0) {
        store.setBatchStatus(batch.id, "error", "vision model returned no usable segments");
        return;
      }
      store.replaceObservations(batch.id, batch.day, segments);
      await this.reviseCards(batch);
      store.setBatchStatus(batch.id, "done");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      store.setBatchStatus(batch.id, "error", message);
      this.deps.logger.warn(`logbook: batch ${batch.id} failed: ${message}`);
    }
  }
  async reviseCards(batch) {
    const store = this.requireStore();
    const lookbackStart = batch.startMs - CARD_LOOKBACK_MS;
    const previousCards = store
      .cardsForDay(batch.day)
      .filter((card) => card.endMs > lookbackStart && card.startMs < batch.endMs);
    const observations = store.observationsInRange(
      batch.day,
      Math.min(lookbackStart, batch.startMs),
      batch.endMs,
    );
    const window = revisionWindow({
      batchStartMs: batch.startMs,
      batchEndMs: batch.endMs,
      previousCards,
    });
    const prompt = buildCardsPrompt({
      day: batch.day,
      observations,
      previousCards,
      windowStartMs: window.startMs,
      windowEndMs: window.endMs,
    });
    const requiredSpans = [
      ...previousCards.map((card) => ({
        startMs: card.startMs,
        endMs: card.endMs,
      })),
      {
        startMs: batch.startMs,
        endMs: batch.endMs,
      },
    ];
    const evaluate = (raw) => {
      const parsed = parseCardsJson({
        raw,
        day: batch.day,
        windowStartMs: window.startMs,
        windowEndMs: window.endMs,
      });
      if (!parsed.ok) return parsed;
      const coverage = validateCardCoverage({
        drafts: parsed.drafts,
        requiredSpans,
        windowStartMs: window.startMs,
        windowEndMs: window.endMs,
      });
      return coverage.ok
        ? parsed
        : {
            ok: false,
            error: coverage.error,
          };
    };
    const first = await this.deps.runtime.llm.complete({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      purpose: "logbook.cards",
      maxTokens: 4e3,
    });
    let parsed = evaluate(first.text);
    if (!parsed.ok)
      parsed = evaluate(
        (
          await this.deps.runtime.llm.complete({
            messages: [
              {
                role: "user",
                content: prompt,
              },
              {
                role: "assistant",
                content: first.text,
              },
              {
                role: "user",
                content: buildCardsCorrectionPrompt(parsed.error),
              },
            ],
            purpose: "logbook.cards.repair",
            maxTokens: 4e3,
          })
        ).text,
      );
    if (!parsed.ok) throw new Error(`card synthesis failed validation: ${parsed.error}`);
    const windowFrames = store.framesInRange(window.startMs, window.endMs).map((frame) => ({
      id: frame.id,
      capturedAtMs: frame.capturedAtMs,
    }));
    const drafts = parsed.drafts.map((draft) =>
      Object.assign(draft, { keyframeId: pickKeyframeId(draft, windowFrames) }),
    );
    store.replaceCardsInWindow(batch.day, window.startMs, window.endMs, drafts);
  }
  async standup(day, refresh) {
    const store = this.requireStore();
    if (!refresh) {
      const cached = store.getStandup(day);
      if (cached) return cached;
    }
    const previousDay = dayKeyFor(
      /* @__PURE__ */ new Date(`${day}T12:00:00`).getTime() - 1440 * 60 * 1e3,
    );
    const result = await this.deps.runtime.llm.complete({
      messages: [
        {
          role: "user",
          content: buildStandupPrompt({
            day,
            cards: store.cardsForDay(day),
            previousDayCards: store.cardsForDay(previousDay),
          }),
        },
      ],
      purpose: "logbook.standup",
      maxTokens: 800,
    });
    store.saveStandup(day, result.text.trim());
    const saved = store.getStandup(day);
    if (!saved) throw new Error("standup save failed");
    return saved;
  }
  async ask(day, question) {
    const store = this.requireStore();
    const observations = store.observationsInRange(day, 0, Number.MAX_SAFE_INTEGER).slice(-200);
    return (
      await this.deps.runtime.llm.complete({
        messages: [
          {
            role: "user",
            content: buildAskPrompt({
              day,
              cards: store.cardsForDay(day),
              observations,
              question,
            }),
          },
        ],
        purpose: "logbook.ask",
        maxTokens: 600,
      })
    ).text.trim();
  }
  cardsForDay(day) {
    return this.requireStore().cardsForDay(day);
  }
  listDays() {
    return this.requireStore().listDays();
  }
  dayStats(day) {
    return this.requireStore().dayStats(day);
  }
  frameById(id) {
    return this.requireStore().frameById(id);
  }
  framesInRange(startMs, endMs) {
    return this.requireStore().framesInRange(startMs, endMs);
  }
  status() {
    const store = this.requireStore();
    const today = dayKeyFor(Date.now());
    const latestBatch = store.latestBatch();
    const vision = this.resolveVisionModel();
    return {
      captureEnabled: this.config.captureEnabled,
      capturePaused: this.capturePaused,
      captureIntervalSeconds: this.config.captureIntervalSeconds,
      analysisIntervalMinutes: this.config.analysisIntervalMinutes,
      retentionDays: this.config.retentionDays,
      nodeId: this.cachedNode?.nodeId ?? this.config.nodeId,
      nodeName: this.cachedNode?.displayName,
      lastCaptureAtMs: this.lastCaptureAtMs,
      lastCaptureError: this.lastCaptureError,
      pendingFrames: store.countUnbatchedActiveFrames(),
      analysisRunning: this.analysisInFlight,
      lastBatch: latestBatch
        ? {
            id: latestBatch.id,
            day: latestBatch.day,
            status: latestBatch.status,
            endMs: latestBatch.endMs,
            error: latestBatch.error,
          }
        : void 0,
      visionModel: vision.ref ? `${vision.ref.provider}/${vision.ref.model}` : void 0,
      visionModelSource: vision.source,
      today,
      todayCards: store.cardsForDay(today).length,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }
  prune() {
    if (!this.store) return;
    const cutoff = Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1e3;
    const removed = this.store.pruneFrames(cutoff);
    if (removed > 0)
      this.deps.logger.info(
        `logbook: pruned ${removed} frames older than ${this.config.retentionDays}d`,
      );
  }
};
//#endregion
//#region extensions/logbook/index.ts
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const logbookConfigSchema = {
  parse(value) {
    return resolveLogbookConfig(value);
  },
};
function readDayParam(params) {
  const day = params?.day;
  if (day === void 0) return dayKeyFor(Date.now());
  if (typeof day !== "string" || !DAY_PATTERN.test(day)) throw new Error("day must be YYYY-MM-DD");
  return day;
}
function readNumberParam(params, key) {
  const value = params?.[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    throw new Error(`${key} must be a positive number`);
  return value;
}
var logbook_default = definePluginEntry({
  id: "logbook",
  name: "Logbook",
  description: "Automatic work journal built from periodic screen snapshots",
  configSchema: logbookConfigSchema,
  nodeHostCommands: [
    {
      command: "logbook.snapshot",
      cap: "screen",
      dangerous: false,
      handle: async (paramsJSON) => {
        const { handleLogbookSnapshot } = await import("../../node-host-DBKXKfjr.js");
        let params;
        try {
          params = paramsJSON ? JSON.parse(paramsJSON) : void 0;
        } catch {
          params = void 0;
        }
        return JSON.stringify(await handleLogbookSnapshot(params));
      },
    },
  ],
  register(api) {
    const config = logbookConfigSchema.parse(api.pluginConfig);
    let service = null;
    const requireService = () => {
      if (!service) throw new Error("Logbook service is not running");
      return service;
    };
    const sendError = (respond, err) => {
      const message = formatErrorMessage(err);
      respond(false, { error: message }, errorShape(ErrorCodes.UNAVAILABLE, message));
    };
    const handle =
      (run) =>
      async ({ params, respond }) => {
        try {
          respond(true, await run(params));
        } catch (err) {
          sendError(respond, err);
        }
      };
    api.session.controls.registerControlUiDescriptor({
      surface: "tab",
      id: "logbook",
      label: "Logbook",
      description: "Your day as a timeline, built from screen snapshots.",
      icon: "sun",
      group: "control",
      requiredScopes: ["operator.write"],
    });
    api.registerNodeInvokePolicy({
      commands: ["logbook.snapshot"],
      defaultPlatforms: ["macos"],
      handle: async (ctx) => {
        if ((ctx.config.gateway?.nodes?.denyCommands ?? []).includes("screen.snapshot"))
          return {
            ok: false,
            code: "SCREEN_CAPTURE_DENIED",
            message:
              "screen capture is denied by gateway.nodes.denyCommands (screen.snapshot); Logbook capture stays blocked until it is removed",
          };
        return await ctx.invokeNode();
      },
    });
    api.registerService({
      id: "logbook",
      start: (ctx) => {
        service = new LogbookService(config, {
          runtime: api.runtime,
          fullConfig: ctx.config,
          logger: ctx.logger,
          dataDir: path.join(ctx.stateDir, "logbook"),
        });
        service.start();
      },
      stop: () => {
        service?.stop();
        service = null;
      },
    });
    const registerRead = (method, run) =>
      api.registerGatewayMethod(method, handle(run), { scope: "operator.read" });
    const registerWrite = (method, run) =>
      api.registerGatewayMethod(method, handle(run), { scope: "operator.write" });
    registerRead("logbook.status", () => requireService().status());
    registerRead("logbook.days", () => ({ days: requireService().listDays() }));
    registerRead("logbook.timeline", (params) => {
      const day = readDayParam(params);
      const svc = requireService();
      return {
        day,
        cards: svc.cardsForDay(day),
        stats: svc.dayStats(day),
      };
    });
    registerWrite("logbook.frames", (params) => {
      const startMs = readNumberParam(params, "startMs");
      const endMs = readNumberParam(params, "endMs");
      return {
        frames: requireService()
          .framesInRange(startMs, endMs)
          .map((frame) => ({
            id: frame.id,
            capturedAtMs: frame.capturedAtMs,
            idle: frame.idle,
          })),
      };
    });
    registerWrite("logbook.frame", (params) => {
      const frameId = readNumberParam(params, "frameId");
      const frame = requireService().frameById(frameId);
      if (!frame) throw new Error(`frame ${frameId} not found`);
      return {
        frameId: frame.id,
        capturedAtMs: frame.capturedAtMs,
        width: frame.width,
        height: frame.height,
        format: "jpeg",
        base64: readFileSync(frame.path).toString("base64"),
      };
    });
    registerWrite("logbook.standup", (params) => {
      const refresh = params?.refresh === true;
      return requireService().standup(readDayParam(params), refresh);
    });
    registerWrite("logbook.ask", async (params) => {
      const question = params?.question;
      if (typeof question !== "string" || question.trim().length === 0)
        throw new Error("question is required");
      return { answer: await requireService().ask(readDayParam(params), question.trim()) };
    });
    registerWrite("logbook.capture.set", (params) => {
      const paused = params?.paused === true;
      const svc = requireService();
      svc.setCapturePaused(paused);
      return svc.status();
    });
    registerWrite("logbook.analyze.now", () => requireService().analyzeNow());
  },
});
//#endregion
export { logbook_default as default };
