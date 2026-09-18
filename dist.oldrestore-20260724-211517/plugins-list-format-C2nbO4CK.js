import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { m as shortenHomeInString } from "./utils-DtcDeqWS.js";
//#region src/cli/plugins-list-format.ts
function formatPluginLine(plugin, verbose = false) {
  const status =
    plugin.status === "error"
      ? theme.error("error")
      : plugin.enabled
        ? theme.success("enabled")
        : theme.warn("disabled");
  const name = theme.command(plugin.name || plugin.id);
  const idSuffix = plugin.name && plugin.name !== plugin.id ? theme.muted(` (${plugin.id})`) : "";
  const desc = plugin.description
    ? theme.muted(
        plugin.description.length > 60
          ? `${truncateUtf16Safe(plugin.description, 57)}...`
          : plugin.description,
      )
    : theme.muted("(no description)");
  const format = plugin.format ?? "openclaw";
  if (!verbose) return `${name}${idSuffix} ${status} ${theme.muted(`[${format}]`)} - ${desc}`;
  const parts = [
    `${name}${idSuffix} ${status}`,
    `  format: ${format}`,
    `  source: ${theme.muted(shortenHomeInString(plugin.source))}`,
    `  origin: ${plugin.origin}`,
  ];
  if (plugin.bundleFormat) parts.push(`  bundle format: ${plugin.bundleFormat}`);
  if (plugin.version) parts.push(`  version: ${plugin.version}`);
  if (plugin.activated !== void 0) parts.push(`  activated: ${plugin.activated ? "yes" : "no"}`);
  if (plugin.imported !== void 0) parts.push(`  imported: ${plugin.imported ? "yes" : "no"}`);
  if (plugin.explicitlyEnabled !== void 0)
    parts.push(`  explicitly enabled: ${plugin.explicitlyEnabled ? "yes" : "no"}`);
  if (plugin.activationSource) parts.push(`  activation source: ${plugin.activationSource}`);
  if (plugin.activationReason)
    parts.push(`  activation reason: ${sanitizeTerminalText(plugin.activationReason)}`);
  if (plugin.providerIds.length > 0) parts.push(`  providers: ${plugin.providerIds.join(", ")}`);
  if (plugin.activated !== void 0 || plugin.activationSource || plugin.activationReason) {
    const activationSummary =
      plugin.activated === false
        ? "inactive"
        : (plugin.activationSource ?? (plugin.activated ? "active" : "inactive"));
    parts.push(`  activation: ${activationSummary}`);
  }
  if (plugin.error) parts.push(theme.error(`  error: ${plugin.error}`));
  return parts.join("\n");
}
//#endregion
export { formatPluginLine };
