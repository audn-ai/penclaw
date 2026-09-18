import { i as listChannelPlugins } from "./registry-mc8oBRx8.js";
//#region src/channels/plugins/lifecycle-startup.ts
/**
 * Runs startup maintenance hooks for all loaded channel plugins.
 */
async function runChannelPluginStartupMaintenance(params) {
  for (const plugin of listChannelPlugins()) {
    const runStartupMaintenance = plugin.lifecycle?.runStartupMaintenance;
    if (!runStartupMaintenance) continue;
    try {
      await runStartupMaintenance(params);
    } catch (err) {
      params.log.warn?.(
        `${params.logPrefix?.trim() || "gateway"}: ${plugin.id} startup maintenance failed; continuing: ${String(err)}`,
      );
    }
  }
}
//#endregion
export { runChannelPluginStartupMaintenance as t };
