import { t as hasConfiguredChannelsForReadOnlyScope } from "./channel-presence-policy-5sGDOKpp.js";
import "./channel-plugin-ids-B1yGqL5H.js";
import { r as withProgress } from "./progress-DXZjrYcT.js";
import { r as buildPluginCompatibilitySnapshotNotices } from "./status-V8msAxCA.js";
import { t as collectStatusScanOverview } from "./status.scan-overview-C-0qzpIB.js";
import {
  i as executeStatusScanFromOverview,
  n as scanStatusJsonWithPolicy,
  r as resolveStatusMemoryStatusSnapshot,
} from "./status.scan.fast-json-EhkPlBGL.js";
//#region src/commands/status.scan.ts
/** Runs the status scan for text or JSON command modes. */
async function scanStatus(opts, _runtime) {
  if (opts.json)
    return await scanStatusJsonWithPolicy(
      {
        timeoutMs: opts.timeoutMs,
        all: opts.all,
      },
      _runtime,
      {
        commandName: "status --json",
        resolveHasConfiguredChannels: (cfg, sourceConfig) =>
          hasConfiguredChannelsForReadOnlyScope({
            config: cfg,
            activationSourceConfig: sourceConfig,
          }),
        resolveMemory: async ({ cfg, agentStatus, memoryPlugin }) =>
          await resolveStatusMemoryStatusSnapshot({
            cfg,
            agentStatus,
            memoryPlugin,
          }),
      },
    );
  return await withProgress(
    {
      label: "Scanning status…",
      total: 10,
      enabled: true,
    },
    async (progress) => {
      const isFullScan = opts.all === true || opts.deep === true;
      const overview = await collectStatusScanOverview({
        commandName: "status",
        opts,
        showSecrets: process.env.OPENCLAW_SHOW_SECRETS?.trim() !== "0",
        includeLiveChannelStatus: isFullScan,
        includeChannelSetupRuntimeFallback: isFullScan,
        channelCredentialResolutionSkipped: !isFullScan,
        includeChannelSecretTargets: isFullScan ? void 0 : false,
        fetchGitUpdate: isFullScan,
        includeRegistryUpdate: isFullScan,
        includeAdvertisedControlUiLinks: true,
        progress,
        labels: {
          loadingConfig: "Loading config…",
          checkingTailscale: "Checking Tailscale…",
          checkingForUpdates: "Checking for updates…",
          resolvingAgents: "Resolving agents…",
          probingGateway: "Probing gateway…",
          queryingChannelStatus: "Querying channel status…",
          summarizingChannels: "Summarizing channels…",
        },
      });
      progress.setLabel("Checking plugins…");
      const pluginCompatibility = opts.all
        ? buildPluginCompatibilitySnapshotNotices({ config: overview.cfg })
        : [];
      progress.tick();
      progress.setLabel("Checking memory and sessions…");
      const result = await executeStatusScanFromOverview({
        overview,
        resolveMemory: async ({ cfg, agentStatus, memoryPlugin }) =>
          opts.all
            ? await resolveStatusMemoryStatusSnapshot({
                cfg,
                agentStatus,
                memoryPlugin,
              })
            : null,
        channelIssues: overview.channelIssues,
        channels: overview.channels,
        pluginCompatibility,
      });
      progress.tick();
      progress.setLabel("Rendering…");
      progress.tick();
      return result;
    },
  );
}
//#endregion
export { scanStatus };
