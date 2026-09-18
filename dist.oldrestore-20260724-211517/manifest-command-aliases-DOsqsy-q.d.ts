//#region src/plugins/manifest-command-aliases.d.ts
type PluginManifestCommandAliasKind = "runtime-slash";
/** One command alias declared by a plugin manifest. */
type PluginManifestCommandAlias = {
  /** Command-like name users may put in plugin config by mistake. */ name: string /** Command family, used for targeted diagnostics. */;
  kind?: PluginManifestCommandAliasKind /** Optional root CLI command that handles related CLI operations. */;
  cliCommand?: string;
};
type PluginManifestCommandAliasRegistry = {
  plugins: readonly {
    id: string;
    enabledByDefault?: boolean;
    commandAliases?: readonly PluginManifestCommandAlias[];
    contracts?: {
      tools?: readonly string[];
    };
  }[];
};
//#endregion
export { PluginManifestCommandAliasRegistry as n, PluginManifestCommandAlias as t };
