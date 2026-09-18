import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { t as applyExclusiveSlotSelection } from "./slots-kpL659LX.js";
import { a as buildPluginDiagnosticsReport } from "./status-V8msAxCA.js";
//#region src/plugins/slot-selection.ts
function mergeRuntimeKinds(report, runtimeReport) {
  const runtimeKinds = new Map(
    runtimeReport.plugins.filter((plugin) => plugin.kind).map((plugin) => [plugin.id, plugin.kind]),
  );
  return {
    plugins: report.plugins.map((plugin) => {
      if (plugin.kind) return plugin;
      const runtimeKind = runtimeKinds.get(plugin.id);
      return runtimeKind
        ? {
            ...plugin,
            kind: runtimeKind,
          }
        : plugin;
    }),
  };
}
function loadRuntimeKindReportForPlugins(config, pluginIds) {
  return buildPluginDiagnosticsReport({
    config,
    onlyPluginIds: [...pluginIds],
  });
}
function buildSlotSelectionRegistry(config, pluginId) {
  return {
    plugins: loadPluginMetadataSnapshot({
      config,
      env: process.env,
    })
      .plugins.filter((plugin) => plugin.id === pluginId)
      .map((plugin) => ({
        id: plugin.id,
        kind: plugin.kind,
      })),
  };
}
function applySlotSelectionForPlugin(config, pluginId) {
  const report = buildSlotSelectionRegistry(config, pluginId);
  const plugin = report.plugins.find((entry) => entry.id === pluginId);
  if (!plugin)
    return {
      config,
      warnings: [],
    };
  if (!plugin.kind) {
    const runtimeReport = loadRuntimeKindReportForPlugins(config, [plugin.id]);
    const runtimePlugin = runtimeReport.plugins.find((entry) => entry.id === plugin.id);
    if (runtimePlugin?.kind) {
      const result = applyExclusiveSlotSelection({
        config,
        selectedId: runtimePlugin.id,
        selectedKind: runtimePlugin.kind,
        registry: mergeRuntimeKinds(report, runtimeReport),
      });
      return {
        config: result.config,
        warnings: result.warnings,
      };
    }
  }
  const result = applyExclusiveSlotSelection({
    config,
    selectedId: plugin.id,
    selectedKind: plugin.kind,
    registry: report,
  });
  return {
    config: result.config,
    warnings: result.warnings,
  };
}
//#endregion
export { applySlotSelectionForPlugin as t };
