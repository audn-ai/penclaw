import { D as searchClawHubPackages } from "./clawhub-CgGOpxts.js";
//#region src/plugins/catalog-search.ts
const INSTALLABLE_PLUGIN_FAMILIES = ["code-plugin", "bundle-plugin"];
const DEFAULT_PLUGIN_SEARCH_LIMIT = 20;
const MAX_PLUGIN_SEARCH_LIMIT = 100;
function resolveSearchLimit(limit) {
  if (!Number.isFinite(limit) || !limit || limit <= 0) return DEFAULT_PLUGIN_SEARCH_LIMIT;
  return Math.min(Math.max(Math.trunc(limit), 1), MAX_PLUGIN_SEARCH_LIMIT);
}
function mergePackageSearchResults(groups, limit) {
  const byName = /* @__PURE__ */ new Map();
  for (const entry of groups.flat()) {
    const existing = byName.get(entry.package.name);
    if (!existing || entry.score > existing.score) byName.set(entry.package.name, entry);
  }
  return [...byName.values()].toSorted((left, right) => right.score - left.score).slice(0, limit);
}
/** Searches installable ClawHub plugin families and merges duplicate packages by best score. */
async function searchInstallablePluginPackages(params) {
  const limit = resolveSearchLimit(params.limit);
  return mergePackageSearchResults(
    await Promise.all(
      INSTALLABLE_PLUGIN_FAMILIES.map((family) =>
        searchClawHubPackages({
          query: params.query,
          family,
          limit,
        }),
      ),
    ),
    limit,
  );
}
//#endregion
export { searchInstallablePluginPackages as t };
