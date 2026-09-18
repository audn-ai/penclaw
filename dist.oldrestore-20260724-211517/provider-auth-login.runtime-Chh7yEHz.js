import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import "./errors-BoHeli7m.js";
import {
  i as parseOAuthCallbackInput,
  n as exchangeChutesCodeForTokens,
  r as generateChutesPkce,
  t as CHUTES_AUTHORIZE_ENDPOINT,
} from "./chutes-oauth-D8-7RZkg.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader-KNgtRNDP.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import { t as loginOpenAICodexOAuth } from "./provider-openai-chatgpt-oauth-Dm2AtPMv.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/chutes-oauth.ts
function parseManualOAuthInput(input, expectedState) {
  const trimmed = normalizeOptionalString(input ?? "") ?? "";
  if (!trimmed) throw new Error("Missing OAuth redirect URL or authorization code.");
  if (!(/^https?:\/\//i.test(trimmed) || trimmed.includes("://") || trimmed.includes("?")))
    return {
      code: trimmed,
      state: expectedState,
    };
  const parsed = parseOAuthCallbackInput(trimmed, expectedState);
  if ("error" in parsed) throw new Error(parsed.error);
  if (parsed.state !== expectedState) throw new Error("Invalid OAuth state");
  return parsed;
}
function buildAuthorizeUrl(params) {
  return `${CHUTES_AUTHORIZE_ENDPOINT}?${new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    response_type: "code",
    scope: params.scopes.join(" "),
    state: params.state,
    code_challenge: params.challenge,
    code_challenge_method: "S256",
  }).toString()}`;
}
async function waitForLocalCallback(params) {
  const redirectUrl = new URL(params.redirectUri);
  if (redirectUrl.protocol !== "http:")
    throw new Error(`Chutes OAuth redirect URI must be http:// (got ${params.redirectUri})`);
  const hostname = redirectUrl.hostname || "127.0.0.1";
  if (!isLoopbackHost(hostname))
    throw new Error(
      `Chutes OAuth redirect hostname must be loopback (got ${hostname}). Use http://127.0.0.1:<port>/...`,
    );
  const port = redirectUrl.port ? Number.parseInt(redirectUrl.port, 10) : 80;
  const expectedPath = redirectUrl.pathname || "/";
  return await new Promise((resolve, reject) => {
    let timeout = null;
    const server = createServer((req, res) => {
      try {
        const requestUrl = new URL(req.url ?? "/", redirectUrl.origin);
        if (requestUrl.pathname !== expectedPath) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end("Not found");
          return;
        }
        const code = requestUrl.searchParams.get("code")?.trim();
        const state = requestUrl.searchParams.get("state")?.trim();
        if (!code) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end("Missing code");
          return;
        }
        if (!state || state !== params.expectedState) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end("Invalid state");
          return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(
          [
            "<!doctype html>",
            "<html><head><meta charset='utf-8' /></head>",
            "<body><h2>Chutes OAuth complete</h2>",
            "<p>You can close this window and return to OpenClaw.</p></body></html>",
          ].join(""),
        );
        if (timeout) clearTimeout(timeout);
        server.close();
        resolve({
          code,
          state,
        });
      } catch (err) {
        if (timeout) clearTimeout(timeout);
        server.close();
        reject(toErrorObject(err, "Non-Error rejection"));
      }
    });
    server.once("error", (err) => {
      if (timeout) clearTimeout(timeout);
      server.close();
      reject(err);
    });
    server.listen(port, hostname, () => {
      params.onProgress?.(`Waiting for OAuth callback on ${redirectUrl.origin}${expectedPath}…`);
    });
    timeout = setTimeout(() => {
      try {
        server.close();
      } catch {}
      reject(/* @__PURE__ */ new Error("OAuth callback timeout"));
    }, params.timeoutMs);
  });
}
/** Run a PKCE OAuth login for Chutes and exchange the resulting code for credentials. */
async function loginChutes(params) {
  const createPkce = params.createPkce ?? generateChutesPkce;
  const createState = params.createState ?? (() => randomBytes(16).toString("hex"));
  const { verifier, challenge } = createPkce();
  const state = createState();
  const timeoutMs = params.timeoutMs ?? 180 * 1e3;
  const url = buildAuthorizeUrl({
    clientId: params.app.clientId,
    redirectUri: params.app.redirectUri,
    scopes: params.app.scopes,
    state,
    challenge,
  });
  let codeAndState;
  if (params.manual) {
    await params.onAuth({ url });
    params.onProgress?.("Waiting for redirect URL…");
    codeAndState = parseManualOAuthInput(
      await params.onPrompt({
        message: "Paste the redirect URL (or authorization code)",
        placeholder: `${params.app.redirectUri}?code=...&state=...`,
      }),
      state,
    );
  } else {
    const callback = waitForLocalCallback({
      redirectUri: params.app.redirectUri,
      expectedState: state,
      timeoutMs,
      onProgress: params.onProgress,
    }).catch(async () => {
      params.onProgress?.("OAuth callback not detected; paste redirect URL…");
      return parseManualOAuthInput(
        await params.onPrompt({
          message: "Paste the redirect URL (or authorization code)",
          placeholder: `${params.app.redirectUri}?code=...&state=...`,
        }),
        state,
      );
    });
    await params.onAuth({ url });
    codeAndState = await callback;
  }
  params.onProgress?.("Exchanging code for tokens…");
  return await exchangeChutesCodeForTokens({
    app: params.app,
    code: codeAndState.code,
    codeVerifier: verifier,
    fetchFn: params.fetchFn,
  });
}
//#endregion
//#region src/plugin-sdk/github-copilot-login.ts
function loadFacadeModule() {
  return loadBundledPluginPublicSurfaceModuleSync({
    dirName: "github-copilot",
    artifactBasename: "api.js",
  });
}
/** @deprecated GitHub Copilot provider-owned login helper; use provider auth hooks instead. */
const githubCopilotLoginCommand = (...args) =>
  loadFacadeModule()["githubCopilotLoginCommand"](...args);
//#endregion
export { githubCopilotLoginCommand, loginChutes, loginOpenAICodexOAuth };
