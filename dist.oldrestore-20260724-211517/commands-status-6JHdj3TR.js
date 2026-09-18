import { i as requireCommandFlagEnabled } from "./command-gates-D1W2Ogk9.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { i as formatDetailedPluginHealth } from "./status-plugin-health-BdTMptTh.js";
import { t as buildStatusText } from "./status-text-CMQWtHv9.js";
//#region src/auto-reply/reply/commands-status.ts
/** Builds /status replies using the command's authorized channel context. */
/** Builds a status reply or suppresses unauthorized status requests. */
async function buildStatusReply(params) {
  const { command } = params;
  if (!command.isAuthorizedSender) {
    logVerbose(`Ignoring /status from unauthorized sender: ${command.senderId || "<unknown>"}`);
    return;
  }
  return {
    text: await buildStatusText({
      ...params,
      statusChannel: command.channel,
      statusAccountId: command.accountId,
    }),
  };
}
async function buildStatusPluginsReply(params) {
  const { command } = params;
  if (!command.isAuthorizedSender) {
    logVerbose(
      `Ignoring /status plugins from unauthorized sender: ${command.senderId || "<unknown>"}`,
    );
    return;
  }
  const disabled = requireCommandFlagEnabled(params.cfg, {
    label: "/status plugins",
    configKey: "plugins",
  });
  if (disabled) return disabled.reply;
  try {
    const { collectInstalledPluginHealthSnapshot } =
      await import("./status-plugin-health.runtime.js");
    return {
      text: formatDetailedPluginHealth(
        await collectInstalledPluginHealthSnapshot({
          config: params.cfg,
          workspaceDir: params.workspaceDir,
        }),
      ),
    };
  } catch (error) {
    return {
      text: `⚠️ Plugins: health unavailable (${error instanceof Error ? error.message : String(error)})`,
    };
  }
}
//#endregion
export { buildStatusReply as n, buildStatusPluginsReply as t };
