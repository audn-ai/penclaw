import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./src-Bl7G9qvi.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./plugins-BKdf-5tW.js";
import { t as resolveMissingOfficialExternalChannelPluginRepairHint } from "./official-external-plugin-repair-hints-Beaxrb9C.js";
import { i as listChannelPlugins } from "./registry-mc8oBRx8.js";
import {
  Ri as validateWebLoginStartParams,
  zi as validateWebLoginWaitParams,
} from "./src-CIJf1lT0.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
import { t as formatForLog } from "./ws-log-BlD6I7mP.js";
//#region src/gateway/server-methods/web.ts
const WEB_LOGIN_METHODS = /* @__PURE__ */ new Set(["web.login.start", "web.login.wait"]);
/** Resolves the channel plugin that currently owns web QR-login methods. */
const resolveWebLoginProvider = () =>
  listChannelPlugins().find((plugin) =>
    [
      ...(plugin.gatewayMethods ?? []),
      ...(plugin.gatewayMethodDescriptors ?? []).map((descriptor) => descriptor.name),
    ].some((method) => WEB_LOGIN_METHODS.has(method)),
  ) ?? null;
function resolveAccountId(params) {
  return typeof params.accountId === "string" ? params.accountId : void 0;
}
function resolveMissingWebLoginPluginHint(context) {
  const cfg = context.getRuntimeConfig();
  const channels = cfg.channels;
  if (!channels || typeof channels !== "object" || Array.isArray(channels)) return null;
  const hints = Object.keys(channels)
    .map((channelId) =>
      resolveMissingOfficialExternalChannelPluginRepairHint({
        config: cfg,
        channelId,
      }),
    )
    .filter((hint) => Boolean(hint));
  if (hints.length === 0) return null;
  if (hints.length === 1) return expectDefined(hints[0], "hints entry at 0").repairHint;
  const labels = [...new Set(hints.map((hint) => hint.label))];
  const installCommands = [...new Set(hints.map((hint) => hint.installCommand))];
  const doctorFixCommand = expectDefined(hints[0], "hints entry at 0").doctorFixCommand;
  return `Configured official external channel plugins are missing for ${labels.join(", ")}. Install them with: ${installCommands.join("; ")}, or run: ${doctorFixCommand}.`;
}
function respondProviderUnavailable(params) {
  const repairHint = resolveMissingWebLoginPluginHint(params.context);
  const message = repairHint
    ? `web login provider is not available. ${repairHint}`
    : "web login provider is not available";
  params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
function respondProviderUnsupported(respond, providerId) {
  respond(
    false,
    void 0,
    errorShape(ErrorCodes.INVALID_REQUEST, `web login is not supported by provider ${providerId}`),
  );
}
function respondWebLoginUnavailable(respond, err) {
  respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
}
/** Resolves a concrete provider gateway login method or sends the public error. */
function resolveWebLoginRequest(params) {
  const accountId = resolveAccountId(params.rawParams);
  const provider = resolveWebLoginProvider();
  if (!provider) {
    respondProviderUnavailable({
      respond: params.respond,
      context: params.context,
    });
    return null;
  }
  const gateway = provider.gateway;
  const run = gateway?.[params.gatewayMethod];
  if (!run) {
    respondProviderUnsupported(params.respond, provider.id);
    return null;
  }
  return {
    accountId,
    provider,
    run: run.bind(gateway),
  };
}
/** Checks whether the matching channel/account should be restored after login start. */
function wasChannelRunning(params) {
  const runtime = params.context.getRuntimeSnapshot();
  if (params.accountId) {
    const accountRuntime = runtime.channelAccounts[params.channelId]?.[params.accountId];
    if (accountRuntime) return accountRuntime.running === true;
  }
  if (!params.accountId) return runtime.channels[params.channelId]?.running === true;
  const defaultRuntime = runtime.channels[params.channelId];
  return defaultRuntime?.accountId === params.accountId && defaultRuntime.running === true;
}
/** Gateway handlers for plugin-owned web QR-login flows. */
const webHandlers = {
  "web.login.start": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateWebLoginStartParams, "web.login.start", respond)) return;
    try {
      const request = resolveWebLoginRequest({
        rawParams: params,
        respond,
        context,
        gatewayMethod: "loginWithQrStart",
      });
      if (!request) return;
      const { accountId, provider, run } = request;
      const wasRunning = wasChannelRunning({
        context,
        channelId: provider.id,
        accountId,
      });
      const forceLogin = Boolean(params.force);
      const stoppedBeforeLogin = forceLogin || !wasRunning;
      if (stoppedBeforeLogin) await context.stopChannel(provider.id, accountId);
      const result = await run({
        force: forceLogin,
        timeoutMs: typeof params.timeoutMs === "number" ? params.timeoutMs : void 0,
        verbose: Boolean(params.verbose),
        accountId,
      });
      const stoppedAfterQrTakeover = !stoppedBeforeLogin && Boolean(result.qrDataUrl);
      if (stoppedAfterQrTakeover) await context.stopChannel(provider.id, accountId);
      const stoppedForLogin = stoppedBeforeLogin || stoppedAfterQrTakeover;
      if (result.connected && stoppedForLogin) await context.startChannel(provider.id, accountId);
      else if (wasRunning && stoppedForLogin && !result.qrDataUrl)
        await context.startChannel(provider.id, accountId);
      respond(true, result, void 0);
    } catch (err) {
      respondWebLoginUnavailable(respond, err);
    }
  },
  "web.login.wait": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateWebLoginWaitParams, "web.login.wait", respond)) return;
    try {
      const request = resolveWebLoginRequest({
        rawParams: params,
        respond,
        context,
        gatewayMethod: "loginWithQrWait",
      });
      if (!request) return;
      const { accountId, provider, run } = request;
      const result = await run({
        timeoutMs: typeof params.timeoutMs === "number" ? params.timeoutMs : void 0,
        accountId,
        currentQrDataUrl:
          typeof params.currentQrDataUrl === "string" ? params.currentQrDataUrl : void 0,
      });
      if (result.connected) await context.startChannel(provider.id, accountId);
      respond(true, result, void 0);
    } catch (err) {
      respondWebLoginUnavailable(respond, err);
    }
  },
};
//#endregion
export { webHandlers };
