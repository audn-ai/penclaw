import {
  d as resolveOpenAiCompatibleHttpSenderIsOwner,
  o as getHeader,
  r as authorizeScopedGatewayHttpRequestOrReply,
  u as resolveOpenAiCompatibleHttpOperatorScopes,
} from "./http-auth-utils-Cm6rPa7b.js";
import {
  a as sendJson,
  n as readJsonBodyOrError,
  o as sendMethodNotAllowed,
} from "./http-common-Czxz795c.js";
import "./message-channel-NQc9DJ6B.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./http-utils-B3cLzhCe.js";
import { t as invokeGatewayTool } from "./tools-invoke-shared-DEJgApzf.js";
//#region src/gateway/tools-invoke-http.ts
const DEFAULT_BODY_BYTES = 2 * 1024 * 1024;
/** Handle `/tools/invoke` requests and return false when another HTTP route should handle them. */
async function handleToolsInvokeHttpRequest(req, res, opts) {
  let url;
  try {
    url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "bad_request",
        message: "Invalid request URL",
      }),
    );
    return true;
  }
  if (url.pathname !== "/tools/invoke") return false;
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, "POST");
    return true;
  }
  const authResult = await authorizeScopedGatewayHttpRequestOrReply({
    req,
    res,
    auth: opts.auth,
    trustedProxies: opts.trustedProxies,
    allowRealIpFallback: opts.allowRealIpFallback,
    rateLimiter: opts.rateLimiter,
    operatorMethod: "agent",
    resolveOperatorScopes: resolveOpenAiCompatibleHttpOperatorScopes,
  });
  if (!authResult) return true;
  const { cfg, requestAuth } = authResult;
  const bodyUnknown = await readJsonBodyOrError(req, res, opts.maxBodyBytes ?? DEFAULT_BODY_BYTES);
  if (bodyUnknown === void 0) return true;
  const body = bodyUnknown ?? {};
  const messageChannel = normalizeMessageChannel(
    getHeader(req, "x-openclaw-message-channel") ?? "",
  );
  const accountId = normalizeOptionalString(getHeader(req, "x-openclaw-account-id"));
  const agentTo = normalizeOptionalString(getHeader(req, "x-openclaw-message-to"));
  const agentThreadId = normalizeOptionalString(getHeader(req, "x-openclaw-thread-id"));
  const senderIsOwner = resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth);
  const outcome = await invokeGatewayTool({
    cfg,
    input: body,
    messageChannel: messageChannel ?? void 0,
    accountId,
    agentTo,
    agentThreadId,
    senderIsOwner,
    conversationReadOrigin: "direct-operator",
    toolCallIdPrefix: "http",
  });
  if (outcome.ok)
    sendJson(res, outcome.status, {
      ok: true,
      result: outcome.result,
    });
  else
    sendJson(res, outcome.status, {
      ok: false,
      error: outcome.error,
    });
  return true;
}
//#endregion
export { handleToolsInvokeHttpRequest };
