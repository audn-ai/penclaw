// In-memory job store with optional disk spill for the async /v1/jobs API.
//
// Why this exists: OpenClaw's OpenAI-compatible /v1/chat/completions is
// synchronous. For long-running agent tasks (pentest planning runs of 5-10+
// minutes) a synchronous HTTP request is the wrong shape — any client-side
// or upstream idle timeout kills the call. The /v1/jobs endpoints expose a
// fire-and-poll (or fire-and-webhook) pattern that decouples request
// submission from completion, so callers can drive long tasks from n8n,
// cron, or any other non-streaming client.
//
// Design notes:
//   * In-memory Map keyed by job_id. O(n) list operations are fine since
//     the store has a natural TTL sweep and we don't expect millions of
//     concurrent jobs per gateway.
//   * Optional disk spill to `${stateDir}/jobs/{id}.json` on terminal
//     transitions so results survive a gateway restart.
//   * Webhook delivery is handled by a separate pump function that reads
//     from the store — keeps the store itself I/O-free.

import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type JobStatus = "queued" | "running" | "done" | "error" | "cancelled";

export interface JobRequestPayload {
  [k: string]: unknown;
}

export interface JobResultPayload {
  [k: string]: unknown;
}

export interface JobErrorPayload {
  message: string;
  type: string;
  code?: string;
  upstream_status?: number;
}

export interface JobRecord {
  id: string;
  status: JobStatus;
  createdAtMs: number;
  startedAtMs?: number;
  finishedAtMs?: number;
  request: JobRequestPayload;
  result?: JobResultPayload;
  error?: JobErrorPayload;
  callbackUrl?: string;
  callbackAttempts: number;
  callbackLastError?: string;
  callbackDeliveredAtMs?: number;
  // Not serialized to disk — lives only for the duration of the run.
  _abort?: AbortController;
  // Auth header captured from the original POST /v1/jobs request so the
  // runner can forward it when calling the buffered /v1/chat/completions
  // loopback. Not persisted.
  _authHeader?: string;
}

export interface JobsStoreOptions {
  stateDir?: string | null;
  ttlMs?: number;
  sweepIntervalMs?: number;
}

const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_SWEEP_INTERVAL_MS = 60 * 1000;

function serialize(record: JobRecord): string {
  const { _abort: _a, _authHeader: _h, ...rest } = record;
  return JSON.stringify(rest, null, 2);
}

function parse(raw: string): JobRecord | null {
  try {
    const parsed = JSON.parse(raw) as JobRecord;
    if (typeof parsed?.id !== "string") {
      return null;
    }
    return { ...parsed, callbackAttempts: parsed.callbackAttempts ?? 0 };
  } catch {
    return null;
  }
}

export class JobsStore {
  private readonly store = new Map<string, JobRecord>();
  private readonly stateDir: string | null;
  private readonly ttlMs: number;
  private readonly sweepIntervalMs: number;
  private sweepTimer: NodeJS.Timeout | null = null;

  constructor(opts: JobsStoreOptions = {}) {
    this.stateDir = opts.stateDir ?? null;
    this.ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
    this.sweepIntervalMs = opts.sweepIntervalMs ?? DEFAULT_SWEEP_INTERVAL_MS;
    if (this.stateDir) {
      try {
        mkdirSync(this.stateDir, { recursive: true });
      } catch {
        // Non-fatal — we degrade to in-memory only.
      }
      this.hydrateFromDisk();
    }
  }

  startSweeper(): void {
    if (this.sweepTimer || this.sweepIntervalMs <= 0) {
      return;
    }
    this.sweepTimer = setInterval(() => {
      try {
        this.sweepExpired();
      } catch {
        // Swallow — sweeper must never throw.
      }
    }, this.sweepIntervalMs);
    if (typeof this.sweepTimer.unref === "function") {
      this.sweepTimer.unref();
    }
  }

  stopSweeper(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
  }

  create(
    request: JobRequestPayload,
    opts: { callbackUrl?: string; authHeader?: string } = {},
  ): JobRecord {
    const id = "job_" + randomUUID();
    const record: JobRecord = {
      id,
      status: "queued",
      createdAtMs: Date.now(),
      request,
      callbackUrl: opts.callbackUrl,
      callbackAttempts: 0,
      _abort: new AbortController(),
      _authHeader: opts.authHeader,
    };
    this.store.set(id, record);
    return record;
  }

  get(id: string): JobRecord | null {
    return this.store.get(id) || null;
  }

  list(): JobRecord[] {
    return Array.from(this.store.values()).toSorted((a, b) => b.createdAtMs - a.createdAtMs);
  }

  transition(
    id: string,
    patch: Partial<
      Pick<
        JobRecord,
        | "status"
        | "result"
        | "error"
        | "startedAtMs"
        | "finishedAtMs"
        | "callbackAttempts"
        | "callbackLastError"
        | "callbackDeliveredAtMs"
      >
    >,
  ): JobRecord | null {
    const record = this.store.get(id);
    if (!record) {
      return null;
    }
    Object.assign(record, patch);
    if (record.status === "done" || record.status === "error" || record.status === "cancelled") {
      if (!record.finishedAtMs) {
        record.finishedAtMs = Date.now();
      }
      this.spillToDisk(record);
    }
    return record;
  }

  cancel(id: string): JobRecord | null {
    const record = this.store.get(id);
    if (!record) {
      return null;
    }
    if (record.status === "done" || record.status === "error" || record.status === "cancelled") {
      return record;
    }
    try {
      record._abort?.abort();
    } catch {
      // No-op if the abort controller has already fired.
    }
    return this.transition(id, {
      status: "cancelled",
      error: { message: "job cancelled", type: "cancelled" },
    });
  }

  sweepExpired(now: number = Date.now()): number {
    let swept = 0;
    for (const [id, record] of this.store) {
      const finished = record.finishedAtMs;
      if (!finished) {
        continue;
      }
      if (now - finished > this.ttlMs) {
        this.store.delete(id);
        swept++;
      }
    }
    return swept;
  }

  size(): number {
    return this.store.size;
  }

  private spillToDisk(record: JobRecord): void {
    if (!this.stateDir) {
      return;
    }
    try {
      const path = join(this.stateDir, `${record.id}.json`);
      writeFileSync(path, serialize(record));
    } catch {
      // Best-effort only.
    }
  }

  private hydrateFromDisk(): void {
    if (!this.stateDir || !existsSync(this.stateDir)) {
      return;
    }
    let files: string[];
    try {
      files = readdirSync(this.stateDir);
    } catch {
      return;
    }
    for (const file of files) {
      if (!file.endsWith(".json")) {
        continue;
      }
      let raw: string;
      try {
        raw = readFileSync(join(this.stateDir, file), "utf-8");
      } catch {
        continue;
      }
      const rec = parse(raw);
      if (!rec) {
        continue;
      }
      if (rec.finishedAtMs && Date.now() - rec.finishedAtMs > this.ttlMs) {
        continue;
      }
      this.store.set(rec.id, rec);
    }
  }
}
