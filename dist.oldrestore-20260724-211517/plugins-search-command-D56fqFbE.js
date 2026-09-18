import { t as searchInstallablePluginPackages } from "./catalog-search-BH7bJjTm.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/plugins-search-command.ts
function formatPackageSearchLine(entry) {
  const pkg = entry.package;
  const flags = [
    pkg.family,
    pkg.channel,
    pkg.isOfficial && pkg.channel !== "official" ? "official" : void 0,
    pkg.latestVersion ? `v${pkg.latestVersion}` : void 0,
  ].filter(Boolean);
  const summary = pkg.summary ? theme.muted(` — ${pkg.summary}`) : "";
  return `${pkg.name}  ${theme.muted(flags.join(" | "))}${summary}\n  ${theme.muted(`Install: openclaw plugins install clawhub:${pkg.name}`)}`;
}
/** Search ClawHub for installable plugins and write JSON or terminal output. */
async function runPluginsSearchCommand(queryParts, opts = {}, runtime = defaultRuntime) {
  const query = normalizeOptionalString(
    Array.isArray(queryParts) ? queryParts.join(" ") : queryParts,
  );
  if (!query) {
    runtime.error("Usage: openclaw plugins search <query>");
    return runtime.exit(1);
  }
  try {
    const results = await searchInstallablePluginPackages({
      query,
      limit: opts.limit,
    });
    if (opts.json) {
      writeRuntimeJson(runtime, { results });
      return;
    }
    if (results.length === 0) {
      runtime.log("No ClawHub plugins found.");
      return;
    }
    runtime.log(`${theme.heading("ClawHub plugins")} ${theme.muted(`(${results.length})`)}`);
    runtime.log(results.map(formatPackageSearchLine).join("\n"));
  } catch (error) {
    runtime.error(formatErrorMessage(error));
    runtime.exit(1);
  }
}
//#endregion
export { runPluginsSearchCommand };
