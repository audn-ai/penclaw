import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { t as quietPluginJsonLogger } from "./plugins-json-logger-D7ZlRw7s.js";
import "./config-BDv-QbJ6.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
//#region src/cli/plugins-list-command.ts
async function loadHumanListModules() {
  const [sourceDisplay, table, themeModule, commandFormat, listFormat] = await Promise.all([
    import("./source-display-D9LCF8Kf.js"),
    import("./terminal-core/table.js"),
    import("./terminal-core/theme.js"),
    import("./command-format-CXDS0zKO.js"),
    import("./plugins-list-format-C2nbO4CK.js"),
  ]);
  return {
    formatPluginLine: listFormat.formatPluginLine,
    formatPluginSourceForTable: sourceDisplay.formatPluginSourceForTable,
    formatCliCommand: commandFormat.formatCliCommand,
    getTerminalTableWidth: table.getTerminalTableWidth,
    renderTable: table.renderTable,
    resolvePluginSourceRoots: sourceDisplay.resolvePluginSourceRoots,
    theme: themeModule.theme,
  };
}
/** Render installed plugin discovery state as JSON, compact table, or verbose text. */
async function runPluginsListCommand(opts, runtime = defaultRuntime) {
  const { buildPluginRegistrySnapshotReport } = await import("./status-snapshot-DtLv5zEV.js");
  const report = buildPluginRegistrySnapshotReport({
    config: getRuntimeConfig(),
    ...(opts.json ? { logger: quietPluginJsonLogger } : {}),
  });
  const list = opts.enabled ? report.plugins.filter((p) => p.enabled) : report.plugins;
  if (opts.json) {
    writeRuntimeJson(runtime, {
      workspaceDir: report.workspaceDir,
      registry: {
        source: report.registrySource,
        diagnostics: report.registryDiagnostics,
      },
      plugins: list,
      diagnostics: report.diagnostics,
    });
    return;
  }
  const {
    formatCliCommand,
    formatPluginLine,
    formatPluginSourceForTable,
    getTerminalTableWidth,
    renderTable,
    resolvePluginSourceRoots,
    theme,
  } = await loadHumanListModules();
  if (list.length === 0) {
    runtime.log(
      theme.muted(
        `No plugins found. Run ${formatCliCommand("openclaw plugins install <plugin>")} to add one, or ${formatCliCommand("openclaw plugins list --json")} to inspect raw discovery state.`,
      ),
    );
    return;
  }
  const enabled = list.filter((p) => p.enabled).length;
  runtime.log(`${theme.heading("Plugins")} ${theme.muted(`(${enabled}/${list.length} enabled)`)}`);
  if (!opts.verbose) {
    const tableWidth = getTerminalTableWidth();
    const sourceRoots = resolvePluginSourceRoots({ workspaceDir: report.workspaceDir });
    const usedRoots = /* @__PURE__ */ new Set();
    const rows = list.map((plugin) => {
      const desc = plugin.description ? theme.muted(plugin.description) : "";
      const formattedSource = formatPluginSourceForTable(plugin, sourceRoots);
      if (formattedSource.rootKey) usedRoots.add(formattedSource.rootKey);
      const sourceLine = desc ? `${formattedSource.value}\n${desc}` : formattedSource.value;
      return {
        Name: plugin.name || plugin.id,
        ID: plugin.name && plugin.name !== plugin.id ? plugin.id : "",
        Format: plugin.format ?? "openclaw",
        Status:
          plugin.status === "error"
            ? theme.error("error")
            : plugin.enabled
              ? theme.success("enabled")
              : theme.warn("disabled"),
        Source: sourceLine,
        Version: plugin.version ?? "",
      };
    });
    if (usedRoots.size > 0) {
      runtime.log(theme.muted("Source roots:"));
      for (const key of ["stock", "workspace", "global"]) {
        if (!usedRoots.has(key)) continue;
        const dir = sourceRoots[key];
        if (!dir) continue;
        runtime.log(`  ${theme.command(`${key}:`)} ${theme.muted(dir)}`);
      }
      runtime.log("");
    }
    runtime.log(
      renderTable({
        width: tableWidth,
        columns: [
          {
            key: "Name",
            header: "Name",
            minWidth: 14,
            flex: true,
          },
          {
            key: "ID",
            header: "ID",
            minWidth: 10,
            flex: true,
          },
          {
            key: "Format",
            header: "Format",
            minWidth: 9,
          },
          {
            key: "Status",
            header: "Status",
            minWidth: 10,
          },
          {
            key: "Source",
            header: "Source",
            minWidth: 26,
            flex: true,
          },
          {
            key: "Version",
            header: "Version",
            minWidth: 8,
          },
        ],
        rows,
      }).trimEnd(),
    );
    return;
  }
  const lines = [];
  for (const plugin of list) {
    lines.push(formatPluginLine(plugin, true));
    lines.push("");
  }
  runtime.log(lines.join("\n").trim());
}
//#endregion
export { runPluginsListCommand };
