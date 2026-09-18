import fs from "node:fs/promises";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { n as channelLabel, t as channelsAddCommand } from "./add-BJy4kcWT.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { c as callGateway } from "./call-BVMO6az_.js";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-BJWJFeyW.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DB_q64I6.js";
import { t as createClackPrompter } from "./clack-prompter-Cu4E8Cn1.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-Ca6zEZc0.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { o as getChannelsCommandSecretTargetIds } from "./command-secret-targets-Dm7sNhry.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { t as requireValidConfigFileSnapshot } from "./config-validation-CDkGn-x8.js";
import {
  c as formatUnknownChannelMessage,
  l as formatUnsupportedChannelActionMessage,
} from "./error-format-CG7mpTEd.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as danger } from "./globals-CNUzHTcU.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-BzNF0htn.js";
import "./plugins-BKdf-5tW.js";
import "./message-channel-NQc9DJ6B.js";
import "./logging-C8NGWOYr.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-BKVujmT7.js";
import { i as getRuntimeConfig, u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { t as channelsListCommand } from "./list-C5hBdBv5.js";
import { n as resolveLogFile } from "./log-tail-DCUXlFWQ.js";
import { a as getResolvedLoggerSettings } from "./logger-BUux_Jpv.js";
import { t as listManifestChannelContributionIds } from "./manifest-contribution-ids-Ba93OZ1q.js";
import {
  l as resolveMessageActionDiscoveryForPlugin,
  r as createMessageActionDiscoveryContext,
} from "./message-action-discovery-B2Y90cRg.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { t as parseLogLine } from "./parse-log-line-nekpsHRk.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DZMZaF9B.js";
import { n as listReadOnlyChannelPluginsForConfig } from "./read-only-D7WTn1n5.js";
import { a as normalizeChannelId$1, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-XzeGvhvw.js";
import { a as normalizeChannelId } from "./registry-xXjI-8UE.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  c as shouldUseWizard,
  o as formatChannelAccountLabel,
  s as requireValidConfig,
} from "./shared-Fs1RU-Wu.js";
import {
  n as formatGatewayChannelsStatusLines,
  t as channelsStatusCommand,
} from "./status-CEkX9ztQ.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/commands/channels/plugin-config-persistence.ts
async function persistResolvedChannelPluginConfig(params) {
  if (!params.resolved.configChanged) return params.resolved.cfg;
  const cfg = params.resolved.cfg;
  if (Boolean(cfg.plugins?.installs && Object.keys(cfg.plugins.installs).length > 0)) {
    const committed = await commitConfigWithPendingPluginInstalls({
      nextConfig: cfg,
      baseHash: params.baseHash,
    });
    await refreshPluginRegistryAfterConfigMutation({
      config: committed.config,
      reason: "source-changed",
      installRecords: committed.installRecords,
      logger: { warn: (message) => params.runtime.log(message) },
    });
    return committed.config;
  }
  await replaceConfigFile({
    nextConfig: cfg,
    baseHash: params.baseHash,
  });
  if (params.resolved.pluginInstalled)
    await refreshPluginRegistryAfterConfigMutation({
      config: cfg,
      reason: "source-changed",
      logger: { warn: (message) => params.runtime.log(message) },
    });
  return cfg;
}
//#endregion
//#region src/commands/channels/capabilities.ts
const CHANNEL_CAPABILITIES_TIMEOUT_MAX_MS = 3e4;
function resolveChannelCapabilitiesTimeoutMs(timeoutMs) {
  return Math.min(timeoutMs, CHANNEL_CAPABILITIES_TIMEOUT_MAX_MS);
}
async function raceChannelCapabilitiesStep(params) {
  let timeout;
  const timeoutPromise = new Promise((resolve) => {
    timeout = setTimeout(() => resolve({ kind: "timeout" }), params.timeoutMs);
    timeout.unref?.();
  });
  const resultPromise = Promise.resolve()
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
    );
  const result = await Promise.race([resultPromise, timeoutPromise]);
  if (timeout) clearTimeout(timeout);
  return result;
}
async function runChannelCapabilitiesProbe(params) {
  const result = await raceChannelCapabilitiesStep(params);
  switch (result.kind) {
    case "value":
      return result.value;
    case "timeout":
      return {
        ok: false,
        timedOut: true,
        error: `probe timed out after ${params.timeoutMs}ms`,
      };
    case "error":
      return {
        ok: false,
        error: formatErrorMessage(result.error),
      };
  }
}
async function runChannelCapabilitiesDiagnostics(params) {
  const result = await raceChannelCapabilitiesStep(params);
  switch (result.kind) {
    case "value":
      return result.value;
    case "timeout":
      return {
        lines: [
          {
            text: `Diagnostics: timed out after ${params.timeoutMs}ms`,
            tone: "error",
          },
        ],
        details: { timedOut: true },
      };
    case "error":
      return {
        lines: [
          {
            text: `Diagnostics: failed (${formatErrorMessage(result.error)})`,
            tone: "error",
          },
        ],
      };
  }
}
function formatSupport(capabilities) {
  if (!capabilities) return "unknown";
  const bits = [];
  if (capabilities.chatTypes?.length) bits.push(`chatTypes=${capabilities.chatTypes.join(",")}`);
  if (capabilities.polls) bits.push("polls");
  if (capabilities.reactions) bits.push("reactions");
  if (capabilities.edit) bits.push("edit");
  if (capabilities.unsend) bits.push("unsend");
  if (capabilities.reply) bits.push("reply");
  if (capabilities.effects) bits.push("effects");
  if (capabilities.groupManagement) bits.push("groupManagement");
  if (capabilities.threads) bits.push("threads");
  if (capabilities.media) bits.push("media");
  if (capabilities.nativeCommands) bits.push("nativeCommands");
  if (capabilities.blockStreaming) bits.push("blockStreaming");
  return bits.length ? bits.join(" ") : "none";
}
function formatGenericProbeLines(probe) {
  if (!probe || typeof probe !== "object") return [];
  const probeObj = probe;
  const ok = typeof probeObj.ok === "boolean" ? probeObj.ok : void 0;
  if (ok === true) return [{ text: "Probe: ok" }];
  if (ok === false)
    return [
      {
        text: `Probe: failed${typeof probeObj.error === "string" && probeObj.error ? ` (${probeObj.error})` : ""}`,
        tone: "error",
      },
    ];
  return [];
}
function renderDisplayLine(line) {
  switch (line.tone) {
    case "muted":
      return theme.muted(line.text);
    case "success":
      return theme.success(line.text);
    case "warn":
      return theme.warn(line.text);
    case "error":
      return theme.error(line.text);
    default:
      return line.text;
  }
}
async function resolveChannelReports(params) {
  const { plugin, cfg, timeoutMs } = params;
  const accountIds = params.accountOverride
    ? [params.accountOverride]
    : (() => {
        const ids = plugin.config.listAccountIds(cfg);
        return ids.length > 0
          ? ids
          : [
              resolveChannelDefaultAccountId({
                plugin,
                cfg,
                accountIds: ids,
              }),
            ];
      })();
  const reports = [];
  for (const accountId of accountIds) {
    const resolvedAccount = plugin.config.resolveAccount(cfg, accountId);
    const configured = plugin.config.isConfigured
      ? await plugin.config.isConfigured(resolvedAccount, cfg)
      : Boolean(resolvedAccount);
    const enabled = plugin.config.isEnabled
      ? plugin.config.isEnabled(resolvedAccount, cfg)
      : resolvedAccount.enabled !== false;
    let probe;
    if (configured && enabled && plugin.status?.probeAccount)
      probe = await runChannelCapabilitiesProbe({
        timeoutMs,
        run: () =>
          plugin.status?.probeAccount?.({
            account: resolvedAccount,
            timeoutMs,
            cfg,
          }),
      });
    const diagnostics =
      configured && enabled && plugin.status?.buildCapabilitiesDiagnostics
        ? await runChannelCapabilitiesDiagnostics({
            timeoutMs,
            run: () =>
              plugin.status?.buildCapabilitiesDiagnostics?.({
                account: resolvedAccount,
                timeoutMs,
                cfg,
                probe,
                target: params.target,
              }),
          })
        : void 0;
    const discoveredActions = resolveMessageActionDiscoveryForPlugin({
      pluginId: plugin.id,
      actions: plugin.actions,
      context: createMessageActionDiscoveryContext({
        cfg,
        accountId,
      }),
      includeActions: true,
    }).actions;
    const actions = Array.from(
      /* @__PURE__ */ new Set(["send", "broadcast", ...discoveredActions.map((action) => action)]),
    );
    reports.push({
      plugin,
      channel: plugin.id,
      accountId,
      accountName:
        typeof resolvedAccount.name === "string"
          ? normalizeOptionalString(resolvedAccount.name)
          : void 0,
      configured,
      enabled,
      support: plugin.capabilities,
      probe,
      actions,
      diagnostics,
    });
  }
  return reports;
}
/** Print or serialize configured channel capabilities, actions, and optional health probe details. */
async function channelsCapabilitiesCommand(opts, runtime = defaultRuntime) {
  const sourceSnapshotPromise = readConfigFileSnapshot().catch(() => null);
  const loadedCfg = await requireValidConfig(runtime);
  if (!loadedCfg) return;
  let cfg = loadedCfg;
  const timeoutMs = resolveChannelCapabilitiesTimeoutMs(
    parseTimeoutMsWithFallback(opts.timeout, 1e4),
  );
  const rawChannel = normalizeLowercaseStringOrEmpty(opts.channel);
  const rawTarget = normalizeOptionalString(opts.target) ?? "";
  if (opts.account && (!rawChannel || rawChannel === "all")) {
    runtime.error(
      danger(
        `--account requires a specific --channel. Run ${formatCliCommand("openclaw channels list")} to choose one.`,
      ),
    );
    runtime.exit(1);
    return;
  }
  if (rawTarget && (!rawChannel || rawChannel === "all")) {
    runtime.error(
      danger(
        `--target requires a specific --channel. Run ${formatCliCommand("openclaw channels list")} to choose one.`,
      ),
    );
    runtime.exit(1);
    return;
  }
  const plugins = listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: true });
  const selected =
    !rawChannel || rawChannel === "all"
      ? plugins
      : await (async () => {
          const resolved = await resolveInstallableChannelPlugin({
            cfg,
            runtime,
            rawChannel,
            allowInstall: true,
          });
          if (resolved.configChanged)
            cfg = await persistResolvedChannelPluginConfig({
              resolved,
              baseHash: (await sourceSnapshotPromise)?.hash,
              runtime,
            });
          return resolved.plugin ? [resolved.plugin] : null;
        })();
  if (!selected || selected.length === 0) {
    if (!rawChannel || rawChannel === "all") {
      if (opts.json) {
        writeRuntimeJson(runtime, { channels: [] });
        return;
      }
      runtime.log(
        theme.muted(
          `No configured channel capabilities found. Run ${formatCliCommand("openclaw channels list --all")} to see available channels.`,
        ),
      );
      return;
    }
    runtime.error(danger(formatUnknownChannelMessage({ channel: rawChannel })));
    runtime.exit(1);
    return;
  }
  const reports = [];
  for (const plugin of selected) {
    const accountOverride = normalizeOptionalString(opts.account);
    reports.push(
      ...(await resolveChannelReports({
        plugin,
        cfg,
        timeoutMs,
        accountOverride,
        target: rawTarget || void 0,
      })),
    );
  }
  if (opts.json) {
    writeRuntimeJson(runtime, { channels: reports });
    return;
  }
  const lines = [];
  for (const report of reports) {
    const label = formatChannelAccountLabel({
      channel: report.channel,
      accountId: report.accountId,
      name: report.accountName,
      channelLabel: report.plugin.meta.label ?? report.channel,
      channelStyle: theme.accent,
      accountStyle: theme.heading,
    });
    lines.push(theme.heading(label));
    lines.push(`Support: ${formatSupport(report.support)}`);
    if (report.actions && report.actions.length > 0)
      lines.push(`Actions: ${report.actions.join(", ")}`);
    if (report.configured === false || report.enabled === false) {
      const configuredLabel = report.configured === false ? "not configured" : "configured";
      const enabledLabel = report.enabled === false ? "disabled" : "enabled";
      lines.push(`Status: ${configuredLabel}, ${enabledLabel}`);
    }
    const formattedProbeLines = report.plugin.status?.formatCapabilitiesProbe?.({
      probe: report.probe,
    });
    const probeLines = formattedProbeLines?.length
      ? formattedProbeLines
      : formatGenericProbeLines(report.probe);
    if (probeLines.length > 0) lines.push(...probeLines.map(renderDisplayLine));
    else if (report.configured && report.enabled) lines.push(theme.muted("Probe: unavailable"));
    if (report.diagnostics?.lines?.length)
      lines.push(...report.diagnostics.lines.map(renderDisplayLine));
    lines.push("");
  }
  runtime.log(lines.join("\n").trimEnd());
}
//#endregion
//#region src/commands/channels/logs.ts
const DEFAULT_LIMIT = 200;
const MAX_BYTES = 1e6;
function listManifestChannelIds() {
  return new Set(
    listManifestChannelContributionIds({
      includeDisabled: true,
      env: process.env,
    }),
  );
}
function parseChannelFilter(raw) {
  const trimmed = normalizeLowercaseStringOrEmpty(raw);
  if (!trimmed || trimmed === "all") return "all";
  const bundled = normalizeChannelId(trimmed);
  if (bundled) return bundled;
  return listManifestChannelIds().has(trimmed) ? trimmed : "all";
}
function matchesChannel(line, channel) {
  if (channel === "all") return true;
  const needle = `gateway/channels/${channel}`;
  if (line.subsystem?.includes(needle)) return true;
  if (line.module?.includes(channel)) return true;
  return false;
}
function parseLinesOption(value) {
  if (value === void 0 || value === null || value === "") return DEFAULT_LIMIT;
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) throw new Error("--lines must be a positive integer.");
  return parsed;
}
async function readTailLines(file, limit) {
  const stat = await fs.stat(file).catch(() => null);
  if (!stat) return [];
  const size = stat.size;
  const start = Math.max(0, size - MAX_BYTES);
  const handle = await fs.open(file, "r");
  try {
    let prefix = "";
    if (start > 0) {
      const prefixBuf = Buffer.alloc(1);
      const prefixRead = await handle.read(prefixBuf, 0, 1, start - 1);
      prefix = prefixBuf.toString("utf8", 0, prefixRead.bytesRead);
    }
    const length = Math.max(0, size - start);
    if (length === 0) return [];
    const buffer = Buffer.alloc(length);
    const readResult = await handle.read(buffer, 0, length, start);
    let lines = buffer.toString("utf8", 0, readResult.bytesRead).split("\n");
    if (start > 0 && prefix !== "\n") lines = lines.slice(1);
    if (lines.length && lines[lines.length - 1] === "") lines = lines.slice(0, -1);
    if (lines.length > limit) lines = lines.slice(lines.length - limit);
    return lines;
  } finally {
    await handle.close();
  }
}
/** Print or serialize recent log lines matching one channel subsystem/module. */
async function channelsLogsCommand(opts, runtime = defaultRuntime) {
  const channel = parseChannelFilter(opts.channel);
  const limit = parseLinesOption(opts.lines);
  const file = await resolveLogFile(getResolvedLoggerSettings().file);
  const filtered = (await readTailLines(file, limit * 4))
    .map(parseLogLine)
    .filter((line) => Boolean(line))
    .filter((line) => matchesChannel(line, channel));
  const lines = filtered.slice(Math.max(0, filtered.length - limit));
  if (opts.json) {
    writeRuntimeJson(runtime, {
      file,
      channel,
      lines,
    });
    return;
  }
  runtime.log(theme.info(`Log file: ${file}`));
  if (channel !== "all") runtime.log(theme.info(`Channel: ${channel}`));
  if (lines.length === 0) {
    runtime.log(theme.muted("No matching log lines."));
    return;
  }
  for (const line of lines) {
    const ts = line.time ? `${line.time} ` : "";
    const level = line.level ? `${normalizeLowercaseStringOrEmpty(line.level)} ` : "";
    runtime.log(`${ts}${level}${line.message}`.trim());
  }
}
//#endregion
//#region src/commands/channels/remove.ts
function listAccountIds(cfg, channel, pluginInput) {
  let plugin = pluginInput;
  plugin ??= getChannelPlugin(channel);
  if (!plugin) return [];
  return plugin.config.listAccountIds(cfg);
}
async function stopGatewayRuntimeBeforeRemove(params) {
  if (!params.plugin.gateway?.startAccount && !params.plugin.gateway?.logoutAccount) return;
  try {
    await callGateway({
      config: params.cfg,
      method: "channels.stop",
      params: {
        channel: params.channel,
        accountId: params.accountId,
      },
      mode: GATEWAY_CLIENT_MODES.BACKEND,
      clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
      deviceIdentity: null,
    });
  } catch (error) {
    params.runtime.log(
      `Could not stop running ${channelLabel(params.channel)} account "${params.accountId}" before removing it: ${formatErrorMessage(error)}`,
    );
  }
}
/** Disable or delete a channel account, stopping gateway runtime state before mutation. */
async function channelsRemoveCommand(opts, runtime = defaultRuntime, params) {
  const configSnapshot = await requireValidConfigFileSnapshot(runtime);
  if (!configSnapshot) return;
  const baseHash = configSnapshot.hash;
  let cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
  const useWizard = shouldUseWizard(params);
  const prompter = useWizard ? createClackPrompter() : null;
  const rawChannel = normalizeOptionalString(opts.channel) ?? "";
  let lookupChannel = rawChannel;
  let channel = normalizeChannelId$1(rawChannel);
  let accountId = normalizeAccountId(opts.account);
  const deleteConfig = Boolean(opts.delete);
  if (useWizard && prompter) {
    await prompter.intro("Remove channel account");
    const readOnlyPlugins = listReadOnlyChannelPluginsForConfig(cfg, {
      includeSetupFallbackPlugins: true,
    });
    const selectedChannel = await prompter.select({
      message: "Channel",
      options: readOnlyPlugins.map((plugin) => ({
        value: plugin.id,
        label: plugin.meta.label,
      })),
    });
    channel = selectedChannel;
    lookupChannel = selectedChannel;
    accountId = await (async () => {
      const readOnlyPlugin = readOnlyPlugins.find((plugin) => plugin.id === selectedChannel);
      const ids = listAccountIds(cfg, selectedChannel, readOnlyPlugin);
      return normalizeAccountId(
        await prompter.select({
          message: "Account",
          options: ids.map((id) => ({
            value: id,
            label: id === "default" ? "default (primary)" : id,
          })),
          initialValue: ids[0] ?? "default",
        }),
      );
    })();
    if (
      !(await prompter.confirm({
        message: `Disable ${channelLabel(selectedChannel)} account "${accountId}"? (keeps config)`,
        initialValue: true,
      }))
    ) {
      await prompter.outro("Cancelled.");
      return;
    }
  } else {
    if (!rawChannel) {
      runtime.error(
        `Missing channel. Use ${formatCliCommand("openclaw channels remove --channel <name>")} or run ${formatCliCommand("openclaw channels status")} to inspect configured channels.`,
      );
      runtime.exit(1);
      return;
    }
    if (!deleteConfig) {
      const confirm = createClackPrompter();
      const channelPromptLabel = channel ? channelLabel(channel) : rawChannel;
      if (
        !(await confirm.confirm({
          message: `Disable ${channelPromptLabel} account "${accountId}"? (keeps config)`,
          initialValue: true,
        }))
      )
        return;
    }
  }
  const resolvedPluginState = Boolean(lookupChannel || channel)
    ? await (async () => {
        const { resolveInstallableChannelPlugin } =
          await import("./channel-plugin-resolution-Dw8L5Ws1.js");
        return await resolveInstallableChannelPlugin({
          cfg,
          runtime,
          rawChannel: lookupChannel,
          allowInstall: false,
        });
      })()
    : null;
  if (resolvedPluginState?.configChanged) cfg = resolvedPluginState.cfg;
  const resolvedChannel = resolvedPluginState?.channelId ?? channel;
  if (!resolvedChannel) {
    runtime.error(formatUnknownChannelMessage({ channel: rawChannel }));
    runtime.exit(1);
    return;
  }
  channel = resolvedChannel;
  const plugin = resolvedPluginState?.plugin ?? getChannelPlugin(resolvedChannel);
  if (!plugin) {
    if (resolvedPluginState?.catalogEntry) {
      runtime.error(
        `Channel plugin "${resolvedPluginState.catalogEntry.id}" is not installed. Run ${formatCliCommand(`openclaw channels add --channel ${resolvedPluginState.catalogEntry.id}`)} first.`,
      );
      runtime.exit(1);
      return;
    }
    runtime.error(formatUnknownChannelMessage({ channel: resolvedChannel }));
    runtime.exit(1);
    return;
  }
  const resolvedChannelId = resolvedChannel;
  const resolvedAccountId =
    normalizeAccountId(accountId) ??
    resolveChannelDefaultAccountId({
      plugin,
      cfg,
    });
  const accountKey = resolvedAccountId || "default";
  await stopGatewayRuntimeBeforeRemove({
    cfg,
    channel: resolvedChannelId,
    accountId: accountKey,
    plugin,
    runtime,
  });
  let next = { ...cfg };
  const prevCfg = cfg;
  if (deleteConfig) {
    if (!plugin.config.deleteAccount) {
      runtime.error(
        `${formatUnsupportedChannelActionMessage({
          channel,
          action: "delete",
        })} Use ${formatCliCommand("openclaw channels remove --channel " + channel)} to disable it without deleting config.`,
      );
      runtime.exit(1);
      return;
    }
    next = plugin.config.deleteAccount({
      cfg: next,
      accountId: resolvedAccountId,
    });
    await plugin.lifecycle?.onAccountRemoved?.({
      prevCfg,
      accountId: resolvedAccountId,
      runtime,
    });
  } else {
    if (!plugin.config.setAccountEnabled) {
      runtime.error(
        `${formatUnsupportedChannelActionMessage({
          channel,
          action: "disable",
        })} Use ${formatCliCommand("openclaw channels remove --channel " + channel + " --delete")} only if you want to remove config.`,
      );
      runtime.exit(1);
      return;
    }
    next = plugin.config.setAccountEnabled({
      cfg: next,
      accountId: resolvedAccountId,
      enabled: false,
    });
    await plugin.lifecycle?.onAccountConfigChanged?.({
      prevCfg,
      nextCfg: next,
      accountId: resolvedAccountId,
      runtime,
    });
  }
  if (Boolean(next.plugins?.installs && Object.keys(next.plugins.installs).length > 0)) {
    const committed = await commitConfigWithPendingPluginInstalls({
      nextConfig: next,
      ...(baseHash !== void 0 ? { baseHash } : {}),
    });
    next = committed.config;
    await refreshPluginRegistryAfterConfigMutation({
      config: next,
      reason: "source-changed",
      installRecords: committed.installRecords,
      logger: { warn: (message) => runtime.log(message) },
    });
  } else {
    await replaceConfigFile({
      nextConfig: next,
      ...(baseHash !== void 0 ? { baseHash } : {}),
    });
    if (resolvedPluginState?.pluginInstalled)
      await refreshPluginRegistryAfterConfigMutation({
        config: next,
        reason: "source-changed",
        logger: { warn: (message) => runtime.log(message) },
      });
  }
  if (useWizard && prompter)
    await prompter.outro(
      deleteConfig
        ? `Deleted ${channelLabel(resolvedChannelId)} account "${accountKey}".`
        : `Disabled ${channelLabel(resolvedChannelId)} account "${accountKey}".`,
    );
  else
    runtime.log(
      deleteConfig
        ? `Deleted ${channelLabel(resolvedChannelId)} account "${accountKey}".`
        : `Disabled ${channelLabel(resolvedChannelId)} account "${accountKey}".`,
    );
}
//#endregion
//#region src/commands/channels/resolve.ts
function resolvePreferredKind(kind) {
  if (!kind || kind === "auto") return;
  if (kind === "user") return "user";
  return "group";
}
function detectAutoKind(input) {
  const trimmed = input.trim();
  if (!trimmed) return "group";
  if (trimmed.startsWith("@")) return "user";
  if (/^<@!?/.test(trimmed)) return "user";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "user";
  if (/^user:/i.test(trimmed)) return "user";
  return "group";
}
function detectAutoKindForPlugin(input, plugin) {
  const generic = detectAutoKind(input);
  if (generic === "user" || !plugin) return generic;
  const lowered = normalizeLowercaseStringOrEmpty(input.trim());
  const prefixes = [plugin.id, ...(plugin.meta?.aliases ?? [])]
    .map((entry) => normalizeOptionalLowercaseString(entry))
    .filter((entry) => Boolean(entry));
  for (const prefix of prefixes) {
    if (!lowered.startsWith(`${prefix}:`)) continue;
    const remainder = lowered.slice(prefix.length + 1);
    if (
      remainder.startsWith("group:") ||
      remainder.startsWith("channel:") ||
      remainder.startsWith("room:") ||
      remainder.startsWith("conversation:") ||
      remainder.startsWith("spaces/") ||
      remainder.startsWith("channels/")
    )
      return "group";
    return "user";
  }
  return generic;
}
function formatResolveResult(result) {
  if (!result.resolved || !result.id) return `${result.input} -> unresolved`;
  const name = result.name ? ` (${result.name})` : "";
  const note = result.note ? ` [${result.note}]` : "";
  return `${result.input} -> ${result.id}${name}${note}`;
}
/** Resolve user/group/channel labels into plugin-specific stable target ids. */
async function channelsResolveCommand(opts, runtime) {
  const sourceSnapshotPromise = readConfigFileSnapshot().catch(() => null);
  let { effectiveConfig: cfg } = await resolveCommandConfigWithSecrets({
    config: getRuntimeConfig(),
    commandName: "channels resolve",
    targetIds: getChannelsCommandSecretTargetIds(),
    mode: "read_only_operational",
    runtime,
    autoEnable: true,
  });
  const entries = normalizeStringEntries(opts.entries);
  if (entries.length === 0)
    throw new Error(
      `At least one entry is required. Example: ${formatCliCommand("openclaw channels resolve --channel discord <name-or-id>")}.`,
    );
  const explicitChannel = opts.channel?.trim();
  const resolvedExplicit = explicitChannel
    ? await resolveInstallableChannelPlugin({
        cfg,
        runtime,
        rawChannel: explicitChannel,
        allowInstall: false,
        supports: (plugin) => Boolean(plugin.resolver?.resolveTargets),
      })
    : null;
  if (explicitChannel && resolvedExplicit?.catalogEntry && !resolvedExplicit.plugin)
    throw new Error(
      `Channel plugin "${resolvedExplicit.catalogEntry.id}" is not installed. Run ${formatCliCommand(`openclaw channels add --channel ${resolvedExplicit.catalogEntry.id}`)} first.`,
    );
  if (resolvedExplicit?.configChanged)
    cfg = await persistResolvedChannelPluginConfig({
      resolved: resolvedExplicit,
      baseHash: (await sourceSnapshotPromise)?.hash,
      runtime,
    });
  const selection = explicitChannel
    ? { channel: resolvedExplicit?.channelId }
    : await resolveMessageChannelSelection({
        cfg,
        channel: opts.channel ?? null,
      });
  const plugin =
    (explicitChannel ? resolvedExplicit?.plugin : void 0) ??
    (selection.channel ? getChannelPlugin(selection.channel) : void 0);
  if (!plugin?.resolver?.resolveTargets) {
    const channelText = selection.channel ?? explicitChannel ?? "";
    throw new Error(
      formatUnsupportedChannelActionMessage({
        channel: channelText,
        action: "resolve",
      }),
    );
  }
  const preferredKind = resolvePreferredKind(opts.kind);
  let results;
  if (preferredKind)
    results = (
      await plugin.resolver.resolveTargets({
        cfg,
        accountId: opts.account ?? null,
        inputs: entries,
        kind: preferredKind,
        runtime,
      })
    ).map((entry) => ({
      input: entry.input,
      resolved: entry.resolved,
      id: entry.id,
      name: entry.name,
      note: entry.note,
    }));
  else {
    const byKind = /* @__PURE__ */ new Map();
    for (const entry of entries) {
      const kind = detectAutoKindForPlugin(entry, plugin);
      byKind.set(kind, [...(byKind.get(kind) ?? []), entry]);
    }
    const resolved = [];
    for (const [kind, inputs] of byKind.entries()) {
      const batch = await plugin.resolver.resolveTargets({
        cfg,
        accountId: opts.account ?? null,
        inputs,
        kind,
        runtime,
      });
      resolved.push(...batch);
    }
    const byInput = new Map(resolved.map((entry) => [entry.input, entry]));
    results = entries.map((input) => {
      const entry = byInput.get(input);
      return {
        input,
        resolved: entry?.resolved ?? false,
        id: entry?.id,
        name: entry?.name,
        note: entry?.note,
      };
    });
  }
  if (opts.json) {
    writeRuntimeJson(runtime, results);
    return;
  }
  for (const result of results)
    if (result.resolved && result.id) runtime.log(formatResolveResult(result));
    else
      runtime.error(
        danger(
          `${result.input} -> unresolved${result.error ? ` (${result.error})` : result.note ? ` (${result.note})` : ""}`,
        ),
      );
}
//#endregion
export {
  channelsAddCommand,
  channelsCapabilitiesCommand,
  channelsListCommand,
  channelsLogsCommand,
  channelsRemoveCommand,
  channelsResolveCommand,
  channelsStatusCommand,
  formatGatewayChannelsStatusLines,
};
