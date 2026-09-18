import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { n as applyChannelAccountConfig } from "./add-mutators-C4GQVKST.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { i as getBundledChannelSetupPlugin } from "./bundled-CmD3EzUu.js";
import { t as createClackPrompter } from "./clack-prompter-Cu4E8Cn1.js";
import "./agent-scope-y9xQv_q1.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { t as requireValidConfigFileSnapshot } from "./config-validation-CDkGn-x8.js";
import {
  c as formatUnknownChannelMessage,
  l as formatUnsupportedChannelActionMessage,
} from "./error-format-CG7mpTEd.js";
import { r as parseOptionalDelimitedEntries } from "./helpers-BzNF0htn.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-BKVujmT7.js";
import "./plugins-BKdf-5tW.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import {
  a as normalizeChannelId,
  n as getLoadedChannelPlugin,
  t as getChannelPlugin,
} from "./registry-mc8oBRx8.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-XzeGvhvw.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { c as moveSingleAccountChannelSectionToDefaultAccount } from "./setup-helpers-Dl0hnWtQ.js";
import { c as shouldUseWizard } from "./shared-Fs1RU-Wu.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/channels/runtime-label.ts
/** Resolve a display label from loaded, setup-only, or bundled channel plugin metadata. */
const channelLabel = (channel) => {
  return (
    (
      getLoadedChannelPlugin(channel) ??
      getBundledChannelSetupPlugin(channel) ??
      getChannelPlugin(channel)
    )?.meta.label ?? channel
  );
};
//#endregion
//#region src/commands/channels/add.ts
const channelSetupPluginInstallLoader = createLazyImportLoader(
  () => import("./plugin-install-BgIV-9o7.js"),
);
const onboardChannelsLoader = createLazyImportLoader(
  () => import("./onboard-channels-BHHrs1du.js"),
);
function loadChannelSetupPluginInstall() {
  return channelSetupPluginInstallLoader.load();
}
function loadOnboardChannels() {
  return onboardChannelsLoader.load();
}
const CHANNEL_ADD_CONTROL_OPTION_KEYS = /* @__PURE__ */ new Set(["channel", "account"]);
const NEXTCLOUD_TALK_CLI_ALIASES = /* @__PURE__ */ new Set(["nextcloud-talk", "nc-talk", "nc"]);
async function resolveCatalogChannelEntry(raw, cfg) {
  const trimmed = normalizeOptionalLowercaseString(raw);
  if (!trimmed) return;
  return (
    cfg
      ? await import("./trusted-catalog-D1S9XJtu.js").then(
          ({ listTrustedChannelPluginCatalogEntries }) =>
            listTrustedChannelPluginCatalogEntries({
              cfg,
              workspaceDir: resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)),
            }),
        )
      : await import("./catalog-B_qWlkIF.js").then(({ listRawChannelPluginCatalogEntries }) =>
          listRawChannelPluginCatalogEntries({ excludeWorkspace: true }),
        )
  ).find((entry) => {
    if (normalizeOptionalLowercaseString(entry.id) === trimmed) return true;
    return (entry.meta.aliases ?? []).some(
      (alias) => normalizeOptionalLowercaseString(alias) === trimmed,
    );
  });
}
function parseOptionalInt(value, flag) {
  if (value === void 0 || value === null || value === "") return;
  const parsed = parseStrictNonNegativeInteger(value);
  if (parsed === void 0) throw new Error(`${flag} must be a non-negative integer.`);
  return parsed;
}
function parseOptionalDelimitedInput(value) {
  if (Array.isArray(value)) return value.filter((entry) => typeof entry === "string");
  return parseOptionalDelimitedEntries(typeof value === "string" ? value : void 0);
}
function readOptionalString(value) {
  return typeof value === "string" && value.length > 0 ? value : void 0;
}
function buildChannelSetupInput(opts) {
  const input = {};
  for (const [key, value] of Object.entries(opts)) {
    if (CHANNEL_ADD_CONTROL_OPTION_KEYS.has(key) || value === void 0) continue;
    input[key] = value;
  }
  const rawChannel = readOptionalString(opts.channel)?.trim().toLowerCase();
  if (rawChannel && NEXTCLOUD_TALK_CLI_ALIASES.has(rawChannel)) {
    input.baseUrl ??= readOptionalString(input.url);
    input.secret ??= readOptionalString(input.token) ?? readOptionalString(input.password);
    input.secretFile ??= readOptionalString(input.tokenFile);
  }
  input.initialSyncLimit = parseOptionalInt(opts.initialSyncLimit, "--initial-sync-limit");
  input.groupChannels = parseOptionalDelimitedInput(opts.groupChannels);
  input.dmAllowlist = parseOptionalDelimitedInput(opts.dmAllowlist);
  return input;
}
/** Add or configure a channel account, using the wizard when no concrete flags are supplied. */
async function channelsAddCommand(opts, runtime = defaultRuntime, params) {
  try {
    return await channelsAddCommandImpl(opts, runtime, params);
  } catch (err) {
    if (err instanceof WizardCancelledError) {
      runtime.exit(1);
      return;
    }
    throw err;
  }
}
async function channelsAddCommandImpl(opts, runtime, params) {
  const configSnapshot = await requireValidConfigFileSnapshot(runtime);
  if (!configSnapshot) return;
  const cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
  const baseHash = configSnapshot.hash;
  let nextConfig = cfg;
  let pluginRegistrySourceChanged = false;
  if (shouldUseWizard(params)) {
    const { resolveInitialWizardChannel, runChannelsAddWizardFlow } =
      await import("./add-wizard-uAg489y7.js");
    const initialChannel = await resolveInitialWizardChannel(opts.channel ?? "", cfg);
    await runChannelsAddWizardFlow({
      cfg,
      ...(baseHash !== void 0 ? { baseHash } : {}),
      runtime,
      prompter: createClackPrompter(),
      ...(initialChannel ? { initialChannel } : {}),
      ...(params?.beforePersistentEffect
        ? { beforePersistentEffect: params.beforePersistentEffect }
        : {}),
    });
    return;
  }
  const rawChannel = opts.channel ?? "";
  let channel = normalizeChannelId(rawChannel);
  let catalogEntry = await resolveCatalogChannelEntry(rawChannel, nextConfig);
  const resolveWorkspaceDir = () =>
    resolveAgentWorkspaceDir(nextConfig, resolveDefaultAgentId(nextConfig));
  const loadScopedPlugin = async (channelId, pluginId) => {
    const existing = getLoadedChannelPlugin(channelId);
    if (existing?.setup?.applyAccountConfig) return existing;
    const { loadChannelSetupPluginRegistrySnapshotForChannel } =
      await loadChannelSetupPluginInstall();
    const snapshot = loadChannelSetupPluginRegistrySnapshotForChannel({
      cfg: nextConfig,
      runtime,
      channel: channelId,
      ...(pluginId ? { pluginId } : {}),
      workspaceDir: resolveWorkspaceDir(),
      forceSetupOnlyChannelPlugins: true,
    });
    return (
      snapshot.channelSetups.find((entry) => entry.plugin.id === channelId)?.plugin ??
      getBundledChannelSetupPlugin(channelId) ??
      snapshot.channels.find((entry) => entry.plugin.id === channelId)?.plugin ??
      existing
    );
  };
  if (catalogEntry) {
    const workspaceDir = resolveWorkspaceDir();
    const { isCatalogChannelInstalled } = await import("./discovery-B2x4f8mn.js");
    const registeredPlugin = channel ? getLoadedChannelPlugin(channel) : void 0;
    const bundledSetupPlugin = channel ? getBundledChannelSetupPlugin(channel) : void 0;
    if (
      !registeredPlugin &&
      !bundledSetupPlugin &&
      !isCatalogChannelInstalled({
        cfg: nextConfig,
        entry: catalogEntry,
        workspaceDir,
      })
    ) {
      const { ensureChannelSetupPluginInstalled } = await loadChannelSetupPluginInstall();
      const prompter = createClackPrompter();
      const result = await ensureChannelSetupPluginInstalled({
        cfg: nextConfig,
        entry: catalogEntry,
        prompter,
        runtime,
        workspaceDir,
        promptInstall: false,
        ...(params?.beforePersistentEffect
          ? { beforePersistentEffect: params.beforePersistentEffect }
          : {}),
      });
      nextConfig = result.cfg;
      if (!result.installed) return;
      pluginRegistrySourceChanged = true;
      catalogEntry = {
        ...catalogEntry,
        ...(result.pluginId ? { pluginId: result.pluginId } : {}),
      };
    }
    channel ??= normalizeChannelId(catalogEntry.id) ?? catalogEntry.id;
  }
  if (!channel) {
    const hint = catalogEntry
      ? `Plugin ${catalogEntry.meta.label} could not be loaded after install. Run openclaw doctor --fix, then retry openclaw channels add.`
      : formatUnknownChannelMessage({ channel: rawChannel });
    runtime.error(hint);
    runtime.exit(1);
    return;
  }
  const plugin = await loadScopedPlugin(channel, catalogEntry?.pluginId);
  if (!plugin?.setup?.applyAccountConfig) {
    runtime.error(
      `${formatUnsupportedChannelActionMessage({
        channel,
        action: "non-interactive add",
      })} Run ${formatCliCommand("openclaw channels add")} with no flags for guided setup.`,
    );
    runtime.exit(1);
    return;
  }
  const input = buildChannelSetupInput(opts);
  const accountId =
    plugin.setup.resolveAccountId?.({
      cfg: nextConfig,
      accountId: opts.account,
      input,
    }) ?? normalizeAccountId(opts.account);
  const validationError = plugin.setup.validateInput?.({
    cfg: nextConfig,
    accountId,
    input,
  });
  if (validationError) {
    runtime.error(validationError);
    runtime.exit(1);
    return;
  }
  const prevConfig = nextConfig;
  if (accountId !== "default")
    nextConfig = moveSingleAccountChannelSectionToDefaultAccount({
      cfg: nextConfig,
      channelKey: channel,
    });
  nextConfig = applyChannelAccountConfig({
    cfg: nextConfig,
    channel,
    accountId,
    input,
    plugin,
  });
  if (plugin.lifecycle?.onAccountConfigChanged) {
    await params?.beforePersistentEffect?.();
    await plugin.lifecycle.onAccountConfigChanged({
      prevCfg: prevConfig,
      nextCfg: nextConfig,
      accountId,
      runtime,
    });
  }
  await params?.beforePersistentEffect?.();
  const committed = await commitConfigWithPendingPluginInstalls({
    nextConfig,
    ...(baseHash !== void 0 ? { baseHash } : {}),
  });
  const writtenConfig = committed.config;
  if (committed.movedInstallRecords || pluginRegistrySourceChanged)
    await refreshPluginRegistryAfterConfigMutation({
      config: writtenConfig,
      reason: "source-changed",
      ...(committed.movedInstallRecords ? { installRecords: committed.installRecords } : {}),
      logger: { warn: (message) => runtime.log(message) },
    });
  runtime.log(`Added ${plugin.meta.label ?? channelLabel(channel)} account "${accountId}".`);
  const afterAccountConfigWritten = plugin.setup?.afterAccountConfigWritten;
  if (afterAccountConfigWritten) {
    const { runCollectedChannelOnboardingPostWriteHooks } = await loadOnboardChannels();
    await runCollectedChannelOnboardingPostWriteHooks({
      hooks: [
        {
          channel,
          accountId,
          run: async ({ cfg: writtenCfg, runtime: hookRuntime }) =>
            await afterAccountConfigWritten({
              previousCfg: cfg,
              cfg: writtenCfg,
              accountId,
              input,
              runtime: hookRuntime,
            }),
        },
      ],
      cfg: writtenConfig,
      runtime,
      ...(params?.beforePersistentEffect
        ? { beforePersistentEffect: params.beforePersistentEffect }
        : {}),
    });
  }
}
//#endregion
export { channelLabel as n, channelsAddCommand as t };
