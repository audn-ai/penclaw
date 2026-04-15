// Production adapter that turns a JobRunnerContext into an
// OpenAI-compatible chat.completion payload. It stands up a one-shot
// in-process HTTP request against the existing /v1/chat/completions
// handler so we reuse the full prompt/image/limits pipeline without
// duplicating it in the jobs code path.

import {
  createServer,
  request as httpRequest,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import type { GatewayHttpChatCompletionsConfig } from "../config/types.gateway.js";
import type { AuthRateLimiter } from "./auth-rate-limit.js";
import type { ResolvedGatewayAuth } from "./auth.js";
import type { JobRequestPayload, JobResultPayload } from "./jobs-store.js";
import { handleOpenAiHttpRequest } from "./openai-http.js";

export interface RunChatCompletionForJobOptions {
  request: JobRequestPayload;
  abortSignal: AbortSignal;
  jobId: string;
  authHeader?: string;
  openAiChatCompletionsConfig?: GatewayHttpChatCompletionsConfig;
  resolvedAuth: ResolvedGatewayAuth;
  rateLimiter?: AuthRateLimiter;
}

let loopbackPort: number | null = null;
let loopbackPromise: Promise<number> | null = null;

/**
 * Start (once per process) a tiny loopback http server that forwards
 * /v1/chat/completions requests into handleOpenAiHttpRequest. We do this
 * in-process so the production runner doesn't have to re-implement the
 * full prompt builder, image pipeline, and limits resolution that
 * openai-http.ts already owns.
 */
function ensureLoopback(opts: RunChatCompletionForJobOptions): Promise<number> {
  if (loopbackPort !== null) {
    return Promise.resolve(loopbackPort);
  }
  if (loopbackPromise) {
    return loopbackPromise;
  }
  loopbackPromise = new Promise<number>((resolve, reject) => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      // Force the path that the OpenAI handler matches on.
      req.url = "/v1/chat/completions";
      void handleOpenAiHttpRequest(req, res, {
        auth: opts.resolvedAuth,
        config: opts.openAiChatCompletionsConfig,
        trustedProxies: ["127.0.0.1", "::1"],
        allowRealIpFallback: true,
        rateLimiter: opts.rateLimiter,
      });
    });
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        loopbackPort = addr.port;
        resolve(addr.port);
      } else {
        reject(new Error("failed to bind jobs loopback server"));
      }
    });
    if (typeof server.unref === "function") {
      server.unref();
    }
  });
  return loopbackPromise;
}

function buildHeaders(request: JobRequestPayload, authHeader?: string): Record<string, string> {
  const hdrs: Record<string, string> = {
    "content-type": "application/json",
  };
  const user = request.user;
  if (typeof user === "string") {
    hdrs["x-openclaw-user"] = user;
  }
  if (authHeader) {
    hdrs.authorization = authHeader;
  }
  return hdrs;
}

export async function runChatCompletionForJob(
  opts: RunChatCompletionForJobOptions,
): Promise<JobResultPayload> {
  const port = await ensureLoopback(opts);
  // Force stream:false so we get a buffered JSON response and don't have
  // to parse SSE inside the runner.
  const bodyPayload = { ...opts.request, stream: false };
  const body = Buffer.from(JSON.stringify(bodyPayload));
  const headers = buildHeaders(opts.request, opts.authHeader);
  headers["content-length"] = String(body.length);

  return new Promise<JobResultPayload>((resolve, reject) => {
    const req = httpRequest(
      {
        host: "127.0.0.1",
        port,
        path: "/v1/chat/completions",
        method: "POST",
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf-8");
          let parsed: unknown;
          try {
            parsed = JSON.parse(raw);
          } catch (err) {
            reject(new Error(`upstream returned non-JSON: ${String(err)}`));
            return;
          }
          if (res.statusCode && res.statusCode >= 400) {
            const error = (parsed as { error?: { message?: string } })?.error;
            const message = error?.message || `upstream status ${res.statusCode}`;
            reject(new Error(message));
            return;
          }
          resolve(parsed as JobResultPayload);
        });
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    opts.abortSignal.addEventListener("abort", () => {
      try {
        req.destroy(new Error("job cancelled"));
      } catch {
        // Nothing to do.
      }
    });
    req.write(body);
    req.end();
  });
}
