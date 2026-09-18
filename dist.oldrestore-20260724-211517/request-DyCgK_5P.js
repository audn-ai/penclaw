import { t as resolveCodexAppServerDirectSandboxBypassBlock } from "./sandbox-guard-D4QOS1Tr.js";
import {
  _ as withTimeout,
  c as getLeasedSharedCodexAppServerClient,
  d as releaseLeasedSharedCodexAppServerClient,
  h as retireSharedCodexAppServerClientIfCurrent,
  l as isCodexAppServerStartSelectionChangedError,
  s as createIsolatedCodexAppServerClient,
} from "./shared-client-a36Mluj-.js";
//#region extensions/codex/src/app-server/request.ts
/** Sends one guarded request over a client lease owned by the caller. */
async function requestCodexAppServerClientJson(params) {
  const sandboxBlock = resolveCodexAppServerDirectSandboxBypassBlock({
    method: params.method,
    requestParams: params.requestParams,
    config: params.config,
    sessionKey: params.sessionKey,
    sessionId: params.sessionId,
  });
  if (sandboxBlock) throw new Error(sandboxBlock);
  const timeoutMs = params.timeoutMs ?? 6e4;
  return await withTimeout(
    params.client.request(params.method, params.requestParams, { timeoutMs }),
    timeoutMs,
    `codex app-server ${params.method} timed out`,
  );
}
async function requestCodexAppServerJson(params) {
  const sandboxBlock = resolveCodexAppServerDirectSandboxBypassBlock({
    method: params.method,
    requestParams: params.requestParams,
    config: params.config,
    sessionKey: params.sessionKey,
    sessionId: params.sessionId,
  });
  if (sandboxBlock) throw new Error(sandboxBlock);
  return await withCodexAppServerJsonClient(
    {
      ...params,
      timeoutMessage: `codex app-server ${params.method} timed out`,
    },
    async (request) =>
      await request({
        method: params.method,
        requestParams: params.requestParams,
      }),
  );
}
/**
 * Runs several guarded requests over one acquired client (shared lease or
 * isolated child) so related reads see the same app-server session. The whole
 * callback re-runs once when the client's start selection changed underneath it.
 */
async function withCodexAppServerJsonClient(params, run) {
  const timeoutMs = params.timeoutMs ?? 6e4;
  const timeoutMessage = params.timeoutMessage ?? "codex app-server request timed out";
  const timeoutController = new AbortController();
  const deadline = Number.isFinite(timeoutMs) && timeoutMs > 0 ? Date.now() + timeoutMs : void 0;
  const isPastDeadline = () => deadline !== void 0 && Date.now() >= deadline;
  const throwIfAbandoned = () => {
    if (timeoutController.signal.aborted || isPastDeadline()) throw new Error(timeoutMessage);
  };
  const remainingTimeoutMs = () => {
    throwIfAbandoned();
    return deadline === void 0 ? timeoutMs : Math.max(1, deadline - Date.now());
  };
  try {
    return await withTimeout(
      (async () => {
        for (let attempt = 0; attempt < 2; attempt += 1) {
          throwIfAbandoned();
          const client = await (
            params.isolated
              ? createIsolatedCodexAppServerClient
              : getLeasedSharedCodexAppServerClient
          )({
            startOptions: params.startOptions,
            pluginConfig: params.pluginConfig,
            timeoutMs: remainingTimeoutMs(),
            authProfileId: params.authProfileId,
            agentDir: params.agentDir,
            config: params.config,
            abandonSignal: timeoutController.signal,
          });
          try {
            throwIfAbandoned();
            const scopedRequest = async (request) => {
              const sandboxBlock = resolveCodexAppServerDirectSandboxBypassBlock({
                method: request.method,
                requestParams: request.requestParams,
                config: params.config,
                sessionKey: params.sessionKey,
                sessionId: params.sessionId,
              });
              if (sandboxBlock) throw new Error(sandboxBlock);
              throwIfAbandoned();
              return await client.request(request.method, request.requestParams, {
                timeoutMs: remainingTimeoutMs(),
                signal: timeoutController.signal,
              });
            };
            return await run(scopedRequest);
          } catch (error) {
            if (!isCodexAppServerStartSelectionChangedError(error) || attempt > 0) throw error;
            if (!params.isolated) retireSharedCodexAppServerClientIfCurrent(client);
            throwIfAbandoned();
          } finally {
            if (params.isolated)
              await client.closeAndWait({
                exitTimeoutMs: params.isolatedShutdown?.exitTimeoutMs ?? 2e3,
                forceKillDelayMs: params.isolatedShutdown?.forceKillDelayMs ?? 250,
              });
            else releaseLeasedSharedCodexAppServerClient(client);
          }
        }
        throw new Error("Codex app-server selection retry loop exited unexpectedly");
      })(),
      timeoutMs,
      timeoutMessage,
    );
  } catch (error) {
    if (isPastDeadline()) throw new Error(timeoutMessage, { cause: error });
    throw error;
  } finally {
    timeoutController.abort();
  }
}
//#endregion
export {
  requestCodexAppServerJson as n,
  withCodexAppServerJsonClient as r,
  requestCodexAppServerClientJson as t,
};
