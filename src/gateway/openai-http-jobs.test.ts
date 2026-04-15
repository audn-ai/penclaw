// Acceptance tests for the /v1/jobs async API.
//
// These tests drive the handler through a real Node http server so we
// exercise the exact HTTP semantics the gateway exposes (status codes,
// response body shape, order of transitions). The runner and webhook
// deliverer are injected as fakes so we don't need to stand up the
// OpenClaw agent runtime.

import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { JobsStore } from "./jobs-store.js";
import {
  type JobRunner,
  JobsHandler,
  makeOpenAiJobsHttpHandler,
  type WebhookDeliverer,
} from "./openai-http-jobs.js";

interface Harness {
  server: Server;
  port: number;
  store: JobsStore;
  handler: JobsHandler;
  webhookHits: Array<{ url: string; body: unknown }>;
  close: () => Promise<void>;
}

async function harness(opts: {
  runner: JobRunner;
  webhookDeliverer?: WebhookDeliverer;
  ttlMs?: number;
  stateDir?: string | null;
  webhookMaxAttempts?: number;
  sleep?: (ms: number) => Promise<void>;
}): Promise<Harness> {
  const store = new JobsStore({ stateDir: opts.stateDir ?? null, ttlMs: opts.ttlMs });
  const webhookHits: Array<{ url: string; body: unknown }> = [];
  const deliverer: WebhookDeliverer =
    opts.webhookDeliverer ??
    (async (url, body) => {
      webhookHits.push({ url, body });
      return { ok: true, status: 200 };
    });
  const handler = new JobsHandler({
    store,
    runner: opts.runner,
    webhookDeliverer: deliverer,
    webhookMaxAttempts: opts.webhookMaxAttempts,
    sleep: opts.sleep,
  });
  const httpHandler = makeOpenAiJobsHttpHandler({
    store,
    runner: opts.runner,
    webhookDeliverer: deliverer,
    webhookMaxAttempts: opts.webhookMaxAttempts,
    sleep: opts.sleep,
  });
  const server = createServer((req, res) => {
    void httpHandler(req, res).then((matched) => {
      if (!matched) {
        res.writeHead(404);
        res.end();
      }
    });
  });
  const port: number = await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve((server.address() as { port: number }).port));
  });
  return {
    server,
    port,
    store,
    handler,
    webhookHits,
    close: () =>
      new Promise<void>((resolve) => {
        store.stopSweeper();
        server.close(() => resolve());
      }),
  };
}

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

async function getJson(url: string) {
  const res = await fetch(url);
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

async function del(url: string) {
  const res = await fetch(url, { method: "DELETE" });
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

async function pollUntil(
  url: string,
  predicate: (body: Record<string, unknown>) => boolean,
  timeoutMs = 3000,
): Promise<Record<string, unknown>> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await getJson(url);
    if (predicate(res.body)) {
      return res.body;
    }
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`pollUntil timeout for ${url}`);
}

describe("openai-http-jobs", () => {
  const cleanups: Array<() => Promise<void>> = [];

  afterEach(async () => {
    for (const fn of cleanups.splice(0)) {
      await fn();
    }
  });

  it("acceptance 1: POST /v1/jobs returns 202 and polls to done", async () => {
    const runner: JobRunner = async () => {
      await new Promise((r) => setTimeout(r, 30));
      return {
        id: "chatcmpl_fake",
        object: "chat.completion",
        created: 111,
        model: "openclaw",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "pong" },
            finish_reason: "stop",
          },
        ],
      };
    };
    const h = await harness({ runner });
    cleanups.push(h.close);

    const create = await post(`http://127.0.0.1:${h.port}/v1/jobs`, {
      model: "openclaw",
      messages: [{ role: "user", content: "ping" }],
    });
    expect(create.status).toBe(202);
    expect(create.body.status).toBe("queued");
    expect(typeof create.body.job_id).toBe("string");

    const jobId = create.body.job_id as string;
    const finalBody = await pollUntil(
      `http://127.0.0.1:${h.port}/v1/jobs/${jobId}`,
      (b) => b.status === "done",
    );
    expect(finalBody.status).toBe("done");
    const choices = (finalBody.result as Record<string, unknown>).choices as Array<
      Record<string, unknown>
    >;
    expect(choices.length).toBe(1);
    expect(choices[0]?.message).toEqual({ role: "assistant", content: "pong" });
  });

  it("acceptance 2: webhook fires once on completion with full payload", async () => {
    const runner: JobRunner = async () => ({
      object: "chat.completion",
      choices: [
        { index: 0, message: { role: "assistant", content: "hello" }, finish_reason: "stop" },
      ],
    });
    const h = await harness({ runner });
    cleanups.push(h.close);

    const create = await post(`http://127.0.0.1:${h.port}/v1/jobs`, {
      messages: [{ role: "user", content: "hi" }],
      callback_url: "http://dummy.test/hook",
    });
    expect(create.status).toBe(202);

    const jobId = create.body.job_id as string;
    await pollUntil(`http://127.0.0.1:${h.port}/v1/jobs/${jobId}`, (b) => b.status === "done");
    await new Promise((r) => setTimeout(r, 50));

    expect(h.webhookHits.length).toBe(1);
    expect(h.webhookHits[0]?.url).toBe("http://dummy.test/hook");
    const body = h.webhookHits[0]?.body as Record<string, unknown>;
    expect(body.job_id).toBe(jobId);
    expect(body.status).toBe("done");
    expect((body.result as Record<string, unknown>)?.object).toBe("chat.completion");
  });

  it("acceptance 3: webhook retries on 503 and eventually succeeds", async () => {
    let calls = 0;
    const deliverer: WebhookDeliverer = async () => {
      calls++;
      if (calls < 3) {
        return { ok: false, status: 503 };
      }
      return { ok: true, status: 200 };
    };
    const runner: JobRunner = async () => ({ object: "chat.completion", choices: [] });
    const h = await harness({
      runner,
      webhookDeliverer: deliverer,
      webhookMaxAttempts: 3,
      sleep: () => Promise.resolve(),
    });
    cleanups.push(h.close);

    const create = await post(`http://127.0.0.1:${h.port}/v1/jobs`, {
      messages: [{ role: "user", content: "x" }],
      callback_url: "http://dummy.test/hook",
    });
    const jobId = create.body.job_id as string;
    await pollUntil(
      `http://127.0.0.1:${h.port}/v1/jobs/${jobId}`,
      (b) => {
        if (b.status !== "done") {
          return false;
        }
        const attempts = b.callback_attempts;
        return typeof attempts === "number" && attempts >= 3;
      },
      5000,
    );
    expect(calls).toBe(3);
  });

  it("acceptance 4: DELETE cancels a running job", async () => {
    let started = false;
    const runner: JobRunner = async (ctx) => {
      started = true;
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => resolve(), 10_000);
        ctx.abortSignal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new Error("aborted"));
        });
      });
      return { never: true };
    };
    const h = await harness({ runner });
    cleanups.push(h.close);

    const create = await post(`http://127.0.0.1:${h.port}/v1/jobs`, {
      messages: [{ role: "user", content: "long" }],
    });
    const jobId = create.body.job_id as string;
    await pollUntil(`http://127.0.0.1:${h.port}/v1/jobs/${jobId}`, (b) => b.status === "running");
    expect(started).toBe(true);
    const cancelled = await del(`http://127.0.0.1:${h.port}/v1/jobs/${jobId}`);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.status).toBe("cancelled");

    const final = await getJson(`http://127.0.0.1:${h.port}/v1/jobs/${jobId}`);
    expect(final.body.status).toBe("cancelled");
    expect((final.body.error as Record<string, unknown>)?.type).toBe("cancelled");
  });

  it("acceptance 5: GET unknown id returns 404 with error shape", async () => {
    const runner: JobRunner = async () => ({ stub: true });
    const h = await harness({ runner });
    cleanups.push(h.close);

    const res = await getJson(`http://127.0.0.1:${h.port}/v1/jobs/nope`);
    expect(res.status).toBe(404);
    expect((res.body.error as Record<string, unknown>)?.message).toContain("not found");
  });

  it("acceptance 6: GET /v1/jobs lists jobs newest-first", async () => {
    const runner: JobRunner = async () => ({ choices: [] });
    const h = await harness({ runner });
    cleanups.push(h.close);

    const created: string[] = [];
    for (let i = 0; i < 3; i++) {
      const res = await post(`http://127.0.0.1:${h.port}/v1/jobs`, {
        messages: [{ role: "user", content: `n${i}` }],
      });
      created.push(res.body.job_id as string);
      await new Promise((r) => setTimeout(r, 5));
    }
    const list = await getJson(`http://127.0.0.1:${h.port}/v1/jobs`);
    expect(list.status).toBe(200);
    const data = list.body.data as Array<Record<string, unknown>>;
    expect(data.length).toBeGreaterThanOrEqual(3);
    const ids = data.map((r) => r.job_id as string);
    const idxNewest = ids.indexOf(created[2]);
    const idxOldest = ids.indexOf(created[0]);
    expect(idxNewest).toBeLessThan(idxOldest);
  });

  it("acceptance 7: POST on /v1/jobs/:id returns 405", async () => {
    const runner: JobRunner = async () => ({});
    const h = await harness({ runner });
    cleanups.push(h.close);
    const res = await fetch(`http://127.0.0.1:${h.port}/v1/jobs/anything`, { method: "POST" });
    expect(res.status).toBe(405);
  });

  it("acceptance 8: completed results persist across store instances (disk spill)", async () => {
    const stateDir = mkdtempSync(join(tmpdir(), "jobs-spill-"));
    try {
      const runner: JobRunner = async () => ({
        object: "chat.completion",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "persisted" },
            finish_reason: "stop",
          },
        ],
      });
      const h = await harness({ runner, stateDir });
      cleanups.push(h.close);

      const create = await post(`http://127.0.0.1:${h.port}/v1/jobs`, {
        messages: [{ role: "user", content: "persist me" }],
      });
      const jobId = create.body.job_id as string;
      await pollUntil(`http://127.0.0.1:${h.port}/v1/jobs/${jobId}`, (b) => b.status === "done");

      const files = readdirSync(stateDir).filter((f) => f.endsWith(".json"));
      expect(files.length).toBeGreaterThanOrEqual(1);

      const replay = new JobsStore({ stateDir });
      const rec = replay.get(jobId);
      expect(rec?.status).toBe("done");
      const choices = (rec?.result?.choices as Array<Record<string, unknown>>) ?? [];
      expect(choices[0]?.message).toEqual({ role: "assistant", content: "persisted" });
    } finally {
      rmSync(stateDir, { recursive: true, force: true });
    }
  });
});
