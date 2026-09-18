import { createServer, request } from "node:http";
import { t as handleOpenAiHttpRequest } from "./openai-http-DfauZJb3.js";
//#region src/gateway/openai-http-jobs-runner.ts
let loopbackPort = null;
let loopbackPromise = null;
/**
 * Start (once per process) a tiny loopback http server that forwards
 * /v1/chat/completions requests into handleOpenAiHttpRequest. We do this
 * in-process so the production runner doesn't have to re-implement the
 * full prompt builder, image pipeline, and limits resolution that
 * openai-http.ts already owns.
 */
function ensureLoopback(opts) {
  if (loopbackPort !== null) return Promise.resolve(loopbackPort);
  if (loopbackPromise) return loopbackPromise;
  loopbackPromise = new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      req.url = "/v1/chat/completions";
      handleOpenAiHttpRequest(req, res, {
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
      } else reject(/* @__PURE__ */ new Error("failed to bind jobs loopback server"));
    });
    if (typeof server.unref === "function") server.unref();
  });
  return loopbackPromise;
}
function buildHeaders(request, authHeader) {
  const hdrs = { "content-type": "application/json" };
  const user = request.user;
  if (typeof user === "string") hdrs["x-openclaw-user"] = user;
  if (authHeader) hdrs.authorization = authHeader;
  return hdrs;
}
async function runChatCompletionForJob(opts) {
  const port = await ensureLoopback(opts);
  const bodyPayload = {
    ...opts.request,
    stream: false,
  };
  const body = Buffer.from(JSON.stringify(bodyPayload));
  const headers = buildHeaders(opts.request, opts.authHeader);
  headers["content-length"] = String(body.length);
  return new Promise((resolve, reject) => {
    const req = request(
      {
        host: "127.0.0.1",
        port,
        path: "/v1/chat/completions",
        method: "POST",
        headers,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf-8");
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch (err) {
            reject(/* @__PURE__ */ new Error(`upstream returned non-JSON: ${String(err)}`));
            return;
          }
          if (res.statusCode && res.statusCode >= 400) {
            const message = parsed?.error?.message || `upstream status ${res.statusCode}`;
            reject(new Error(message));
            return;
          }
          resolve(parsed);
        });
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    opts.abortSignal.addEventListener("abort", () => {
      try {
        req.destroy(/* @__PURE__ */ new Error("job cancelled"));
      } catch {}
    });
    req.write(body);
    req.end();
  });
}
//#endregion
export { runChatCompletionForJob };
