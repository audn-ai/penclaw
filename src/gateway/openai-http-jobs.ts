// HTTP handlers for the async /v1/jobs API that wraps OpenAI-compatible
// chat completions. See jobs-store.ts for the data model.
//
// Endpoints:
//   POST   /v1/jobs       — enqueue a job, return 202 { job_id }
//   GET    /v1/jobs       — list recent jobs
//   GET    /v1/jobs/:id   — fetch a single job record
//   DELETE /v1/jobs/:id   — cancel a running/queued job
//
// The runner callback is injected so tests can substitute a deterministic
// fake. In production the runner calls `agentCommandFromIngress` just like
// the buffered path in openai-http.ts and serializes the OpenAI response
// object.

import type { IncomingMessage, ServerResponse } from "node:http";
import type { AuthRateLimiter } from "./auth-rate-limit.js";
import type { ResolvedGatewayAuth } from "./auth.js";
import { authorizeGatewayBearerRequestOrReply } from "./http-auth-helpers.js";
import { sendJson } from "./http-common.js";
import type {
  JobErrorPayload,
  JobRecord,
  JobRequestPayload,
  JobResultPayload,
} from "./jobs-store.js";
import { JobsStore } from "./jobs-store.js";

export interface JobRunnerContext {
  request: JobRequestPayload;
  abortSignal: AbortSignal;
  jobId: string;
  authHeader?: string;
}

export type JobRunner = (ctx: JobRunnerContext) => Promise<JobResultPayload>;

export interface WebhookDeliverer {
  (url: string, body: unknown): Promise<{ ok: boolean; status?: number; errorMessage?: string }>;
}

export interface JobsHandlerOptions {
  store: JobsStore;
  runner: JobRunner;
  /**
   * Webhook delivery function. Defaults to a real `fetch`-based
   * implementation with retries, but tests inject a fake.
   */
  webhookDeliverer?: WebhookDeliverer;
  /** Max body size for POST /v1/jobs bodies. Default 20 MiB. */
  maxBodyBytes?: number;
  /**
   * Retries on webhook delivery before giving up. Default 3 attempts in
   * total (1 initial + 2 retries), with exponential backoff.
   */
  webhookMaxAttempts?: number;
  /** Sleep helper (overridable for tests). */
  sleep?: (ms: number) => Promise<void>;
  /**
   * Optional gateway auth config. When provided, every incoming /v1/jobs
   * request is authenticated with the same bearer-token check the
   * /v1/chat/completions stage uses, so anonymous callers cannot spam
   * the store. Omitted in unit tests that want to drive the handler
   * without full auth context.
   */
  auth?: ResolvedGatewayAuth;
  trustedProxies?: string[];
  allowRealIpFallback?: boolean;
  rateLimiter?: AuthRateLimiter;
}

const DEFAULT_MAX_BODY_BYTES = 20 * 1024 * 1024;
const DEFAULT_WEBHOOK_MAX_ATTEMPTS = 3;

function log(tag: string, ...args: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] [JOBS:${tag}]`, ...args);
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function defaultWebhookDeliverer(
  url: string,
  body: unknown,
): Promise<{ ok: boolean; status?: number; errorMessage?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      return { ok: res.ok, status: res.status };
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    return { ok: false, errorMessage: err instanceof Error ? err.message : String(err) };
  }
}

async function readJsonBody(req: IncomingMessage, maxBytes: number): Promise<JobRequestPayload> {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error("request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8");
      if (!raw) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(raw) as JobRequestPayload);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function serializeRecordForApi(record: JobRecord): Record<string, unknown> {
  return {
    job_id: record.id,
    status: record.status,
    created: Math.floor(record.createdAtMs / 1000),
    started: record.startedAtMs ? Math.floor(record.startedAtMs / 1000) : undefined,
    finished: record.finishedAtMs ? Math.floor(record.finishedAtMs / 1000) : undefined,
    result: record.result,
    error: record.error,
    callback_url: record.callbackUrl,
    callback_attempts: record.callbackAttempts,
    callback_last_error: record.callbackLastError,
  };
}

export class JobsHandler {
  readonly store: JobsStore;
  private readonly runner: JobRunner;
  private readonly webhookDeliverer: WebhookDeliverer;
  private readonly maxBodyBytes: number;
  private readonly webhookMaxAttempts: number;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly auth?: ResolvedGatewayAuth;
  private readonly trustedProxies?: string[];
  private readonly allowRealIpFallback?: boolean;
  private readonly rateLimiter?: AuthRateLimiter;

  constructor(opts: JobsHandlerOptions) {
    this.store = opts.store;
    this.runner = opts.runner;
    this.webhookDeliverer = opts.webhookDeliverer ?? defaultWebhookDeliverer;
    this.maxBodyBytes = opts.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
    this.webhookMaxAttempts = opts.webhookMaxAttempts ?? DEFAULT_WEBHOOK_MAX_ATTEMPTS;
    this.sleep = opts.sleep ?? defaultSleep;
    this.auth = opts.auth;
    this.trustedProxies = opts.trustedProxies;
    this.allowRealIpFallback = opts.allowRealIpFallback;
    this.rateLimiter = opts.rateLimiter;
  }

  private async authorizeOrReject(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    if (!this.auth) {
      // Tests drive the handler without auth context.
      return true;
    }
    return authorizeGatewayBearerRequestOrReply({
      req,
      res,
      auth: this.auth,
      trustedProxies: this.trustedProxies,
      allowRealIpFallback: this.allowRealIpFallback,
      rateLimiter: this.rateLimiter,
    });
  }

  /**
   * Returns `true` if the request was handled, `false` otherwise. Matches
   * the existing request-stage convention in server-http.ts.
   */
  async handle(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const url = req.url || "";
    if (!url.startsWith("/v1/jobs")) {
      return false;
    }
    const method = req.method || "GET";
    const path = url.split("?")[0] ?? url;

    if (path === "/v1/jobs") {
      if (method === "POST") {
        if (!(await this.authorizeOrReject(req, res))) {
          return true;
        }
        await this.handleCreate(req, res);
        return true;
      }
      if (method === "GET") {
        if (!(await this.authorizeOrReject(req, res))) {
          return true;
        }
        this.handleList(res);
        return true;
      }
      sendJson(res, 405, {
        error: { message: "method not allowed", type: "invalid_request_error" },
      });
      return true;
    }

    const idMatch = /^\/v1\/jobs\/([^/]+)$/.exec(path);
    if (idMatch) {
      const jobId = decodeURIComponent(idMatch[1] ?? "");
      if (method === "GET") {
        if (!(await this.authorizeOrReject(req, res))) {
          return true;
        }
        this.handleGet(res, jobId);
        return true;
      }
      if (method === "DELETE") {
        if (!(await this.authorizeOrReject(req, res))) {
          return true;
        }
        this.handleDelete(res, jobId);
        return true;
      }
      sendJson(res, 405, {
        error: { message: "method not allowed", type: "invalid_request_error" },
      });
      return true;
    }

    sendJson(res, 404, { error: { message: "not found", type: "invalid_request_error" } });
    return true;
  }

  private async handleCreate(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let body: JobRequestPayload;
    try {
      body = await readJsonBody(req, this.maxBodyBytes);
    } catch (err) {
      sendJson(res, 400, {
        error: {
          message: `invalid request body: ${err instanceof Error ? err.message : String(err)}`,
          type: "invalid_request_error",
        },
      });
      return;
    }

    const callbackUrl = typeof body.callback_url === "string" ? body.callback_url : undefined;
    const { callback_url: _drop, ...requestWithoutCallback } = body;

    // Capture the Authorization header so the background runner can forward
    // it when calling the internal buffered /v1/chat/completions pipeline.
    const authRaw = req.headers.authorization;
    const authHeader = typeof authRaw === "string" ? authRaw : undefined;

    const record = this.store.create(requestWithoutCallback, { callbackUrl, authHeader });
    sendJson(res, 202, serializeRecordForApi(record));

    // Kick off the background runner. We do not await it.
    void this.runJob(record.id);
  }

  private handleList(res: ServerResponse): void {
    const records = this.store.list().map(serializeRecordForApi);
    sendJson(res, 200, { data: records });
  }

  private handleGet(res: ServerResponse, jobId: string): void {
    const record = this.store.get(jobId);
    if (!record) {
      sendJson(res, 404, {
        error: { message: `job not found: ${jobId}`, type: "invalid_request_error" },
      });
      return;
    }
    sendJson(res, 200, serializeRecordForApi(record));
  }

  private handleDelete(res: ServerResponse, jobId: string): void {
    const record = this.store.cancel(jobId);
    if (!record) {
      sendJson(res, 404, {
        error: { message: `job not found: ${jobId}`, type: "invalid_request_error" },
      });
      return;
    }
    sendJson(res, 200, serializeRecordForApi(record));
    if (record.status === "cancelled" && record.callbackUrl) {
      void this.deliverWebhook(jobId);
    }
  }

  private async runJob(jobId: string): Promise<void> {
    const record = this.store.get(jobId);
    if (!record) {
      return;
    }
    if (record.status !== "queued") {
      return;
    }
    this.store.transition(jobId, { status: "running", startedAtMs: Date.now() });
    try {
      const abortSignal = record._abort?.signal ?? new AbortController().signal;
      const result = await this.runner({
        request: record.request,
        abortSignal,
        jobId,
        authHeader: record._authHeader,
      });
      const fresh = this.store.get(jobId);
      if (!fresh) {
        return;
      }
      if (fresh.status === "cancelled") {
        return;
      } // already terminal
      this.store.transition(jobId, { status: "done", result });
    } catch (err) {
      const isAbort =
        err instanceof Error && (err.name === "AbortError" || /abort/i.test(err.message || ""));
      const fresh = this.store.get(jobId);
      if (!fresh) {
        return;
      }
      if (fresh.status === "cancelled") {
        return;
      }
      const errPayload: JobErrorPayload = isAbort
        ? { message: "job cancelled", type: "cancelled" }
        : {
            message: err instanceof Error ? err.message : String(err),
            type: "api_error",
          };
      this.store.transition(jobId, {
        status: isAbort ? "cancelled" : "error",
        error: errPayload,
      });
    }
    await this.deliverWebhook(jobId);
  }

  private async deliverWebhook(jobId: string): Promise<void> {
    const record = this.store.get(jobId);
    if (!record || !record.callbackUrl) {
      return;
    }
    if (record.callbackDeliveredAtMs) {
      return;
    } // already delivered

    const body = {
      job_id: record.id,
      status: record.status,
      result: record.result,
      error: record.error,
    };

    let lastError: string | undefined;
    for (let attempt = 1; attempt <= this.webhookMaxAttempts; attempt++) {
      const outcome = await this.webhookDeliverer(record.callbackUrl, body);
      this.store.transition(jobId, {
        callbackAttempts: attempt,
        callbackLastError: outcome.ok
          ? undefined
          : (outcome.errorMessage ?? `status=${outcome.status}`),
      });
      if (outcome.ok) {
        this.store.transition(jobId, { callbackDeliveredAtMs: Date.now() });
        return;
      }
      lastError = outcome.errorMessage ?? `status=${outcome.status}`;
      if (attempt < this.webhookMaxAttempts) {
        const backoffMs = Math.min(30_000, 2000 * 2 ** (attempt - 1));
        await this.sleep(backoffMs);
      }
    }
    log("WEBHOOK-GIVEUP", jobId, "attempts=", this.webhookMaxAttempts, "lastError=", lastError);
  }
}

/**
 * Top-level handler function that can be registered as a stage in
 * server-http.ts alongside the existing OpenAI chat/completions handler.
 */
export function makeOpenAiJobsHttpHandler(opts: JobsHandlerOptions) {
  const handler = new JobsHandler(opts);
  return (req: IncomingMessage, res: ServerResponse): Promise<boolean> => handler.handle(req, res);
}
