import { t as applyAccountName } from "./add-mutators-C4GQVKST.js";
import "./agent-scope-y9xQv_q1.js";
import "./account-id-C7N4Rwku.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as describeBinding } from "./agents.binding-format-C3S9Mq5U.js";
import "./config-BDv-QbJ6.js";
import { t as applyAgentBindings } from "./agents.bindings-DKqOOMOo.js";
import "./plugins-BKdf-5tW.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-BKVujmT7.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { n as getLoadedChannelPlugin } from "./registry-mc8oBRx8.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-XzeGvhvw.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/channels/add-wizard.ts
async function loadOnboardChannels() {
  return await import("./onboard-channels-BHHrs1du.js");
}
/** Resolve a raw channel name/alias against the installed setup entries. */
async function resolveInitialWizardChannel(raw, cfg) {
  const normalized = normalizeOptionalLowercaseString(raw);
  if (!normalized) return;
  const [{ listActiveChannelSetupPlugins }, { resolveChannelSetupEntries }] = await Promise.all([
    import("./setup-registry-DbvXfkoR.js"),
    import("./discovery-B2x4f8mn.js"),
  ]);
  return resolveChannelSetupEntries({
    cfg,
    installedPlugins: listActiveChannelSetupPlugins(),
    workspaceDir: resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)),
  }).entries.find(
    (entry) =>
      normalizeOptionalLowercaseString(entry.id) === normalized ||
      (entry.meta.aliases ?? []).some(
        (alias) => normalizeOptionalLowercaseString(alias) === normalized,
      ),
  )?.id;
}
/** Run the interactive channel-setup flow and persist the resulting config. */
async function runChannelsAddWizardFlow(params) {
  const { cfg, baseHash, runtime, prompter } = params;
  const [{ buildAgentSummaries }, onboardChannels] = await Promise.all([
    import("./agents.config-BPBg_1yE.js"),
    loadOnboardChannels(),
  ]);
  const postWriteHooks = onboardChannels.createChannelOnboardingPostWriteHookCollector();
  let selection = [];
  const accountIds = {};
  const resolvedPlugins = /* @__PURE__ */ new Map();
  await prompter.intro("Channel setup");
  let nextConfig = await onboardChannels.setupChannels(cfg, runtime, prompter, {
    ...(params.initialChannel ? { initialSelection: [params.initialChannel] } : {}),
    allowDisable: false,
    allowIMessageInstall: true,
    allowSignalInstall: true,
    ...(params.beforePersistentEffect
      ? { beforePersistentEffect: params.beforePersistentEffect }
      : {}),
    ...(params.deferDeviceLinkToClient ? { deferDeviceLinkToClient: true } : {}),
    onPostWriteHook: (hook) => {
      postWriteHooks.collect(hook);
    },
    promptAccountIds: true,
    deferStatusUntilSelection: true,
    skipStatusNote: true,
    onSelection: (value) => {
      selection = value;
    },
    onAccountId: (channel, accountId) => {
      accountIds[channel] = accountId;
    },
    onResolvedPlugin: (channel, plugin) => {
      resolvedPlugins.set(channel, plugin);
    },
  });
  if (selection.length === 0) {
    await prompter.outro("No channel changes made.");
    return;
  }
  if (
    await prompter.confirm({
      message: "Name these channel accounts now? (optional)",
      initialValue: false,
    })
  )
    for (const channel of selection) {
      const accountId = accountIds[channel] ?? "default";
      const plugin = resolvedPlugins.get(channel) ?? getLoadedChannelPlugin(channel);
      const account = plugin?.config.resolveAccount(nextConfig, accountId);
      const existingName =
        plugin?.config.describeAccount?.(account, nextConfig)?.name ?? account?.name;
      const name = await prompter.text({
        message: `${channel} display name for account "${accountId}"`,
        initialValue: existingName,
      });
      if (name?.trim())
        nextConfig = applyAccountName({
          cfg: nextConfig,
          channel,
          accountId,
          name,
          plugin,
        });
    }
  const bindTargets = selection
    .map((channel) => ({
      channel,
      accountId: accountIds[channel]?.trim(),
    }))
    .filter((value) => Boolean(value.accountId));
  if (bindTargets.length > 0) {
    if (
      await prompter.confirm({
        message: "Route these channel accounts to agents now?",
        initialValue: true,
      })
    ) {
      const agentSummaries = buildAgentSummaries(nextConfig);
      const defaultAgentId = resolveDefaultAgentId(nextConfig);
      for (const target of bindTargets) {
        const targetAgentId = await prompter.select({
          message: `Send ${target.channel}/${target.accountId} messages to agent`,
          options: agentSummaries.map((agent) => ({
            value: agent.id,
            label: agent.isDefault ? `${agent.id} (default)` : agent.id,
          })),
          initialValue: defaultAgentId,
        });
        const bindingResult = applyAgentBindings(nextConfig, [
          {
            agentId: targetAgentId,
            match: {
              channel: target.channel,
              accountId: target.accountId,
            },
          },
        ]);
        nextConfig = bindingResult.config;
        if (bindingResult.added.length > 0 || bindingResult.updated.length > 0)
          await prompter.note(
            [
              ...bindingResult.added.map((binding) => `Added: ${describeBinding(binding)}`),
              ...bindingResult.updated.map((binding) => `Updated: ${describeBinding(binding)}`),
            ].join("\n"),
            "Routing bindings",
          );
        if (bindingResult.conflicts.length > 0)
          await prompter.note(
            [
              "Skipped bindings already claimed by another agent:",
              ...bindingResult.conflicts.map(
                (conflict) =>
                  `- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`,
              ),
            ].join("\n"),
            "Routing bindings",
          );
      }
    }
  }
  await params.beforePersistentEffect?.();
  const committed = await commitConfigWithPendingPluginInstalls({
    nextConfig,
    ...(baseHash !== void 0 ? { baseHash } : {}),
  });
  const writtenConfig = committed.config;
  if (committed.movedInstallRecords)
    await refreshPluginRegistryAfterConfigMutation({
      config: writtenConfig,
      reason: "source-changed",
      installRecords: committed.installRecords,
      logger: { warn: (message) => runtime.log(message) },
    });
  await onboardChannels.runCollectedChannelOnboardingPostWriteHooks({
    hooks: postWriteHooks.drain(),
    cfg: writtenConfig,
    runtime,
    ...(params.beforePersistentEffect
      ? { beforePersistentEffect: params.beforePersistentEffect }
      : {}),
  });
  params.onConfigured?.(
    selection.map((channel) => ({
      channel,
      accountId: accountIds[channel] ?? "default",
    })),
  );
  await prompter.outro("Channels updated.");
}
/**
 * Gateway entry for `wizard.start {flow:"channels"}`. Unlike the CLI path this
 * must never call runtime.exit — failures throw and surface as wizard errors.
 */
async function runChannelsSetupWizard(opts, runtime, prompter) {
  const snapshot = await readConfigFileSnapshot();
  if (snapshot.exists && !snapshot.valid)
    throw new Error(
      "OpenClaw config is invalid; run `openclaw doctor --fix`, then retry channel setup.",
    );
  const cfg = snapshot.sourceConfig ?? snapshot.config;
  const initialChannel = opts.channel
    ? await resolveInitialWizardChannel(opts.channel, cfg)
    : void 0;
  await runChannelsAddWizardFlow({
    cfg,
    ...(snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {}),
    runtime,
    prompter,
    ...(initialChannel ? { initialChannel } : {}),
    deferDeviceLinkToClient: true,
    ...(opts.onConfigured ? { onConfigured: opts.onConfigured } : {}),
    ...(opts.beforePersistentEffect ? { beforePersistentEffect: opts.beforePersistentEffect } : {}),
  });
}
//#endregion
export { resolveInitialWizardChannel, runChannelsAddWizardFlow, runChannelsSetupWizard };
