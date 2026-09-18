import { t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import { t as buildChannelUiCatalog } from "./catalog-wn_skeE9.js";
import { t as getChannelActivity } from "./channel-activity-4piA219h.js";
import {
  n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
  r as evaluateChannelHealth,
  t as DEFAULT_CHANNEL_CONNECT_GRACE_MS,
} from "./channel-health-policy-Bd5WQkSH.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./config-BDv-QbJ6.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-BzNF0htn.js";
import "./plugins-BKdf-5tW.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import {
  a as normalizeChannelId,
  i as listChannelPlugins,
  t as getChannelPlugin,
} from "./registry-mc8oBRx8.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as resolveGatewayPluginConfig } from "./runtime-plugin-config-mrPiwDuw.js";
import {
  A as validateChannelsStatusParams,
  O as validateChannelsLogoutParams,
  j as validateChannelsStopParams,
  k as validateChannelsStartParams,
} from "./src-CIJf1lT0.js";
import { t as buildChannelAccountSnapshot } from "./status-DZ3jOxQw.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import { t as formatForLog } from "./ws-log-BlD6I7mP.js";
//#region src/gateway/server-methods/channels.ts
function resolveChannelOperationParams(params) {
  const rawParams = params.rawParams;
  if (!assertValidParams(rawParams, params.validate, params.method, params.respond)) return null;
  const rawChannel = rawParams.channel;
  const channelId = typeof rawChannel === "string" ? normalizeChannelId(rawChannel) : null;
  if (!channelId) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${params.method} channel`),
    );
    return null;
  }
  return {
    params: rawParams,
    rawChannel,
    channelId,
  };
}
async function respondWithChannelOperationPayload(params) {
  try {
    params.respond(true, await params.run(), void 0);
  } catch (error) {
    params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(error)));
  }
}
const CHANNEL_STATUS_MAX_TIMEOUT_MS = 3e4;
const CHANNEL_STATUS_PROBE_CONCURRENCY = 5;
function channelStatusTimeoutPayload(step, timeoutMs) {
  return {
    ok: false,
    timedOut: true,
    error: `${step} timed out after ${timeoutMs}ms`,
  };
}
async function raceWithTimeout(params) {
  const timeoutMs = params.timeoutMs;
  let timer = null;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ kind: "timeout" }), timeoutMs);
    if (typeof timer === "object" && "unref" in timer) timer.unref();
  });
  const result = await Promise.race([
    Promise.resolve()
      .then(params.run)
      .then(
        (value) => ({
          kind: "value",
          value,
        }),
        (error) => ({
          kind: "error",
          error,
        }),
      ),
    timeout,
  ]);
  if (timer) clearTimeout(timer);
  return result;
}
async function runChannelStatusHook(params) {
  const timeoutMs = Math.max(1, params.timeoutMs);
  const result = await raceWithTimeout({
    timeoutMs,
    run: params.run,
  });
  if (result.kind === "value") return result.value;
  const warningPrefix = `${params.channelId}:${params.accountId} ${params.step}`;
  if (result.kind === "timeout") {
    params.warnings.push(`${warningPrefix} timed out after ${timeoutMs}ms`);
    return channelStatusTimeoutPayload(params.step, timeoutMs);
  }
  const message = formatForLog(result.error);
  params.warnings.push(`${warningPrefix} failed: ${message}`);
  return {
    ok: false,
    error: message,
  };
}
async function runChannelStatusSummary(params) {
  const timeoutMs = Math.max(1, params.timeoutMs);
  const result = await raceWithTimeout({
    timeoutMs,
    run: params.run,
  });
  const warningPrefix = `${params.channelId} summary`;
  if (result.kind === "value")
    return {
      ok: true,
      value: result.value,
    };
  if (result.kind === "timeout") {
    const error = `summary timed out after ${timeoutMs}ms`;
    params.warnings.push(`${warningPrefix} timed out after ${timeoutMs}ms`);
    return {
      ok: false,
      timedOut: true,
      error,
    };
  }
  const message = formatForLog(result.error);
  params.warnings.push(`${warningPrefix} failed: ${message}`);
  return {
    ok: false,
    error: message,
  };
}
function channelStatusFailureMessage(value) {
  if (!value || typeof value !== "object") return null;
  const record = value;
  if (record.ok !== false || typeof record.error !== "string" || record.error.length === 0)
    return null;
  return record.error;
}
function resolveChannelsStatusTimeoutMs(params) {
  const fallback = params.probe ? CHANNEL_STATUS_MAX_TIMEOUT_MS : 1e4;
  if (typeof params.timeoutMsRaw !== "number" || !Number.isFinite(params.timeoutMsRaw))
    return fallback;
  return Math.min(Math.max(1e3, params.timeoutMsRaw), CHANNEL_STATUS_MAX_TIMEOUT_MS);
}
function resolveRuntimeAccountSnapshot(params) {
  const direct = params.runtime.channelAccounts[params.channelId]?.[params.accountId];
  if (direct) return direct;
  const fallback = params.runtime.channels[params.channelId];
  return fallback?.accountId === params.accountId ? fallback : void 0;
}
function resolveChannelGatewayAccountId(params) {
  return (
    normalizeOptionalString(params.accountId) ||
    params.plugin.config.defaultAccountId?.(params.cfg) ||
    params.plugin.config.listAccountIds(params.cfg)[0] ||
    "default"
  );
}
/** Log out one channel account through its owning channel plugin. */
async function logoutChannelAccount(params) {
  const resolvedAccountId = resolveChannelGatewayAccountId(params);
  const account = params.plugin.config.resolveAccount(params.cfg, resolvedAccountId);
  await params.context.stopChannel(params.channelId, resolvedAccountId);
  const result = await params.plugin.gateway?.logoutAccount?.({
    cfg: params.cfg,
    accountId: resolvedAccountId,
    account,
    runtime: defaultRuntime,
  });
  if (!result) throw new Error(`Channel ${params.channelId} does not support logout`);
  const cleared = result.cleared;
  if (typeof result.loggedOut === "boolean" ? result.loggedOut : cleared)
    params.context.markChannelLoggedOut(params.channelId, true, resolvedAccountId);
  return {
    channel: params.channelId,
    accountId: resolvedAccountId,
    ...result,
    cleared,
  };
}
/** Start one channel account through its owning channel plugin. */
async function startChannelAccount(params) {
  if (!params.plugin.gateway?.startAccount)
    throw new Error(`Channel ${params.channelId} does not support runtime start`);
  const resolvedAccountId = resolveChannelGatewayAccountId(params);
  await params.context.startChannel(params.channelId, resolvedAccountId, { manual: true });
  const started =
    resolveRuntimeAccountSnapshot({
      runtime: params.context.getRuntimeSnapshot(),
      channelId: params.channelId,
      accountId: resolvedAccountId,
    })?.running === true;
  return {
    channel: params.channelId,
    accountId: resolvedAccountId,
    started,
  };
}
/** Stop one channel account through its owning channel plugin. */
async function stopChannelAccount(params) {
  const resolvedAccountId = resolveChannelGatewayAccountId(params);
  await params.context.stopChannel(params.channelId, resolvedAccountId);
  const stopped =
    resolveRuntimeAccountSnapshot({
      runtime: params.context.getRuntimeSnapshot(),
      channelId: params.channelId,
      accountId: resolvedAccountId,
    })?.running !== true;
  return {
    channel: params.channelId,
    accountId: resolvedAccountId,
    stopped,
  };
}
/** Gateway request handlers for channel list, status, start, stop, and logout. */
const channelsHandlers = {
  "channels.status": async ({ params, respond, context }) => {
    if (!validateChannelsStatusParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid channels.status params: ${formatValidationErrors(validateChannelsStatusParams.errors)}`,
        ),
      );
      return;
    }
    const probe = params.probe === true;
    const timeoutMsRaw = params.timeoutMs;
    const timeoutMs = resolveChannelsStatusTimeoutMs({
      probe,
      timeoutMsRaw,
    });
    const rawChannel = params.channel;
    const requestedChannel =
      typeof rawChannel === "string" ? normalizeChannelId(rawChannel) : void 0;
    const cfg = resolveGatewayPluginConfig({ config: context.getRuntimeConfig() });
    const runtime = context.getRuntimeSnapshot();
    const plugins = listChannelPlugins();
    const selectedPlugins = requestedChannel
      ? plugins.filter((plugin) => plugin.id === requestedChannel)
      : plugins;
    if (rawChannel !== void 0 && !requestedChannel) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `unknown channel: ${formatForLog(rawChannel)}`),
      );
      return;
    }
    const pluginMap = new Map(selectedPlugins.map((plugin) => [plugin.id, plugin]));
    const statusWarnings = [];
    const resolveRuntimeSnapshot = (channelId, accountId, defaultAccountId) => {
      const accounts = runtime.channelAccounts[channelId];
      const defaultRuntimeLocal = runtime.channels[channelId];
      const raw =
        accounts?.[accountId] ?? (accountId === defaultAccountId ? defaultRuntimeLocal : void 0);
      if (!raw) return;
      return raw;
    };
    const isAccountEnabled = (plugin, account) =>
      plugin.config.isEnabled
        ? plugin.config.isEnabled(account, cfg)
        : !account || typeof account !== "object" || account.enabled !== false;
    const buildAccountSnapshot = async (channelId, plugin, accountId, defaultAccountId) => {
      const account = plugin.config.resolveAccount(cfg, accountId);
      const enabled = isAccountEnabled(plugin, account);
      let probeResult;
      let lastProbeAt = null;
      if (probe && enabled && plugin.status?.probeAccount) {
        let configured = true;
        if (plugin.config.isConfigured) configured = await plugin.config.isConfigured(account, cfg);
        if (configured) {
          probeResult = await runChannelStatusHook({
            channelId,
            accountId,
            step: "probe",
            timeoutMs,
            warnings: statusWarnings,
            run: () =>
              plugin.status.probeAccount({
                account,
                timeoutMs,
                cfg,
              }),
          });
          lastProbeAt = Date.now();
        }
      }
      let auditResult;
      if (probe && enabled && plugin.status?.auditAccount) {
        let configured = true;
        if (plugin.config.isConfigured) configured = await plugin.config.isConfigured(account, cfg);
        if (configured)
          auditResult = await runChannelStatusHook({
            channelId,
            accountId,
            step: "audit",
            timeoutMs,
            warnings: statusWarnings,
            run: () =>
              plugin.status.auditAccount({
                account,
                timeoutMs,
                cfg,
                probe: probeResult,
              }),
          });
      }
      const runtimeSnapshot = resolveRuntimeSnapshot(channelId, accountId, defaultAccountId);
      const snapshot = await buildChannelAccountSnapshot({
        plugin,
        cfg,
        accountId,
        runtime: runtimeSnapshot,
        probe: probeResult,
        audit: auditResult,
      });
      const hookError =
        channelStatusFailureMessage(auditResult) ?? channelStatusFailureMessage(probeResult);
      if (hookError && !snapshot.lastError) snapshot.lastError = hookError;
      if (lastProbeAt) snapshot.lastProbeAt = lastProbeAt;
      const activity = getChannelActivity({
        channel: channelId,
        accountId,
      });
      if (snapshot.lastInboundAt == null) snapshot.lastInboundAt = activity.inboundAt;
      if (snapshot.lastOutboundAt == null) snapshot.lastOutboundAt = activity.outboundAt;
      const health = evaluateChannelHealth(snapshot, {
        channelId,
        now: Date.now(),
        staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
        channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS,
      });
      if (!health.healthy) snapshot.healthState = health.reason;
      return {
        accountId,
        account,
        snapshot,
      };
    };
    const buildChannelAccounts = async (channelId) => {
      const plugin = pluginMap.get(channelId);
      if (!plugin)
        return {
          accounts: [],
          defaultAccountId: DEFAULT_ACCOUNT_ID,
          defaultAccount: void 0,
          resolvedAccounts: {},
        };
      const accountIds = plugin.config.listAccountIds(cfg);
      const defaultAccountId = resolveChannelDefaultAccountId({
        plugin,
        cfg,
        accountIds,
      });
      const resolvedAccounts = {};
      const { results } = await runTasksWithConcurrency({
        tasks: accountIds.map(
          (accountId) => async () =>
            await buildAccountSnapshot(channelId, plugin, accountId, defaultAccountId),
        ),
        limit: probe ? CHANNEL_STATUS_PROBE_CONCURRENCY : accountIds.length || 1,
      });
      const accounts = [];
      for (const result of results)
        if (result) {
          resolvedAccounts[result.accountId] = result.account;
          accounts.push(result.snapshot);
        }
      return {
        accounts,
        defaultAccountId,
        defaultAccount:
          accounts.find((entry) => entry.accountId === defaultAccountId) ?? accounts[0],
        resolvedAccounts,
      };
    };
    const uiCatalog = buildChannelUiCatalog(selectedPlugins);
    const payload = {
      ts: Date.now(),
      channelOrder: uiCatalog.order,
      channelLabels: uiCatalog.labels,
      channelDetailLabels: uiCatalog.detailLabels,
      channelSystemImages: uiCatalog.systemImages,
      channelMeta: uiCatalog.entries,
      ...(context.getEventLoopHealth ? { eventLoop: context.getEventLoopHealth() } : {}),
      channels: {},
      channelAccounts: {},
      channelDefaultAccountId: {},
    };
    const channelsMap = payload.channels;
    const accountsMap = payload.channelAccounts;
    const defaultAccountIdMap = payload.channelDefaultAccountId;
    const { results: channelResults } = await runTasksWithConcurrency({
      tasks: selectedPlugins.map((plugin) => async () => {
        const { accounts, defaultAccountId, defaultAccount, resolvedAccounts } =
          await buildChannelAccounts(plugin.id);
        const fallbackAccount =
          resolvedAccounts[defaultAccountId] ?? plugin.config.resolveAccount(cfg, defaultAccountId);
        const fallbackSummary = (lastError) => ({
          configured: defaultAccount?.configured ?? false,
          ...(lastError ? { lastError } : {}),
        });
        let summary = fallbackSummary();
        if (plugin.status?.buildChannelSummary) {
          const summaryResult = await runChannelStatusSummary({
            channelId: plugin.id,
            timeoutMs,
            warnings: statusWarnings,
            run: () =>
              plugin.status.buildChannelSummary({
                account: fallbackAccount,
                cfg,
                defaultAccountId,
                snapshot: defaultAccount ?? { accountId: defaultAccountId },
              }),
          });
          summary = summaryResult.ok ? summaryResult.value : fallbackSummary(summaryResult.error);
        }
        return {
          pluginId: plugin.id,
          summary,
          accounts,
          defaultAccountId,
        };
      }),
      limit: probe ? CHANNEL_STATUS_PROBE_CONCURRENCY : selectedPlugins.length || 1,
    });
    for (const result of channelResults)
      if (result) {
        channelsMap[result.pluginId] = result.summary;
        accountsMap[result.pluginId] = result.accounts;
        defaultAccountIdMap[result.pluginId] = result.defaultAccountId;
      }
    if (statusWarnings.length > 0) {
      payload.partial = true;
      payload.warnings = statusWarnings.slice(0, 50);
    }
    respond(true, payload, void 0);
  },
  "channels.start": async ({ params, respond, context }) => {
    const resolved = resolveChannelOperationParams({
      method: "channels.start",
      rawParams: params,
      respond,
      validate: validateChannelsStartParams,
    });
    if (!resolved) return;
    const { params: parsedParams, rawChannel, channelId } = resolved;
    const plugin = getChannelPlugin(channelId);
    if (!plugin) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `unknown channel: ${formatForLog(rawChannel)}`),
      );
      return;
    }
    if (!plugin.gateway?.startAccount) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `channel ${channelId} does not support start`),
      );
      return;
    }
    await respondWithChannelOperationPayload({
      respond,
      run: () =>
        startChannelAccount({
          channelId,
          accountId: parsedParams.accountId,
          cfg: resolveGatewayPluginConfig({ config: context.getRuntimeConfig() }),
          context,
          plugin,
        }),
    });
  },
  "channels.stop": async ({ params, respond, context }) => {
    const resolved = resolveChannelOperationParams({
      method: "channels.stop",
      rawParams: params,
      respond,
      validate: validateChannelsStopParams,
    });
    if (!resolved) return;
    const { params: parsedParams, channelId } = resolved;
    const plugin = getChannelPlugin(channelId);
    if (!plugin) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `unknown channel ${channelId}`),
      );
      return;
    }
    const accountId = normalizeOptionalString(parsedParams.accountId);
    await respondWithChannelOperationPayload({
      respond,
      run: () =>
        stopChannelAccount({
          channelId,
          accountId,
          cfg: context.getRuntimeConfig(),
          context,
          plugin,
        }),
    });
  },
  "channels.logout": async ({ params, respond, context }) => {
    const resolved = resolveChannelOperationParams({
      method: "channels.logout",
      rawParams: params,
      respond,
      validate: validateChannelsLogoutParams,
    });
    if (!resolved) return;
    const { params: parsedParams, channelId } = resolved;
    const plugin = getChannelPlugin(channelId);
    if (!plugin?.gateway?.logoutAccount) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `channel ${channelId} does not support logout`),
      );
      return;
    }
    const accountId = normalizeOptionalString(parsedParams.accountId);
    if (!(await readConfigFileSnapshot()).valid) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "config invalid; fix it before logging out"),
      );
      return;
    }
    await respondWithChannelOperationPayload({
      respond,
      run: () =>
        logoutChannelAccount({
          channelId,
          accountId,
          cfg: context.getRuntimeConfig(),
          context,
          plugin,
        }),
    });
  },
};
//#endregion
export { channelsHandlers };
