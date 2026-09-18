import {
  l as resolveFeishuRuntimeAccount,
  r as listEnabledFeishuAccounts,
} from "./accounts-upJPqv8I.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as fetchBotIdentityForMonitor } from "./monitor.startup-Ch3u6kYe.js";
//#region extensions/feishu/src/monitor.ts
const loadMonitorAccountRuntime = createLazyRuntimeModule(
  () => import("./monitor.account-DJg6fxjR.js"),
);
async function monitorFeishuProvider(opts = {}) {
  const cfg = opts.config;
  if (!cfg) throw new Error("Config is required for Feishu monitor");
  const log = opts.runtime?.log ?? console.log;
  if (opts.accountId) {
    const account = resolveFeishuRuntimeAccount(
      {
        cfg,
        accountId: opts.accountId,
      },
      { requireEventSecrets: true },
    );
    if (!account.enabled || !account.configured)
      throw new Error(`Feishu account "${opts.accountId}" not configured or disabled`);
    const { monitorSingleAccount } = await loadMonitorAccountRuntime();
    return monitorSingleAccount({
      cfg,
      account,
      channelRuntime: opts.channelRuntime,
      runtime: opts.runtime,
      abortSignal: opts.abortSignal,
      ...(opts.statusSink ? { statusSink: opts.statusSink } : {}),
    });
  }
  const accounts = listEnabledFeishuAccounts(cfg);
  if (accounts.length === 0) throw new Error("No enabled Feishu accounts configured");
  log(
    `feishu: starting ${accounts.length} account(s): ${accounts.map((a) => a.accountId).join(", ")}`,
  );
  const { monitorSingleAccount } = await loadMonitorAccountRuntime();
  const monitorPromises = [];
  for (const account of accounts) {
    if (opts.abortSignal?.aborted) {
      log("feishu: abort signal received during startup preflight; stopping startup");
      break;
    }
    const { botOpenId, botName } = await fetchBotIdentityForMonitor(account, {
      runtime: opts.runtime,
      abortSignal: opts.abortSignal,
    });
    if (opts.abortSignal?.aborted) {
      log("feishu: abort signal received during startup preflight; stopping startup");
      break;
    }
    monitorPromises.push(
      monitorSingleAccount({
        cfg,
        account,
        channelRuntime: opts.channelRuntime,
        runtime: opts.runtime,
        abortSignal: opts.abortSignal,
        botOpenIdSource: {
          kind: "prefetched",
          botOpenId,
          botName,
        },
        ...(opts.statusSink ? { statusSink: opts.statusSink } : {}),
      }),
    );
  }
  await Promise.all(monitorPromises);
}
//#endregion
export { monitorFeishuProvider };
