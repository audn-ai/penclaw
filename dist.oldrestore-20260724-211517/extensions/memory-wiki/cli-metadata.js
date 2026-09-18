import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
//#region extensions/memory-wiki/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
  id: "memory-wiki",
  name: "Memory Wiki",
  description: "Persistent wiki compiler and Obsidian-friendly knowledge vault for OpenClaw.",
  register(api) {
    api.registerCli(
      async ({ program, config: appConfig }) => {
        const [{ registerWikiCli }, { resolveMemoryWikiAgentConfig, resolveMemoryWikiConfig }] =
          await Promise.all([import("../../cli-DtUryyVm.js"), import("../../config-DW3LuVEn.js")]);
        const pluginConfig = appConfig.plugins?.entries?.["memory-wiki"]?.config;
        const config = resolveMemoryWikiConfig(pluginConfig);
        registerWikiCli(program, {
          config,
          getAppConfig: () => appConfig,
          resolveConfig: (agentId, currentAppConfig) =>
            resolveMemoryWikiAgentConfig({
              config,
              appConfig: currentAppConfig ?? appConfig,
              ...(agentId ? { agentId } : {}),
            }),
        });
      },
      {
        descriptors: [
          {
            name: "wiki",
            description: "Inspect and initialize the memory wiki vault",
            hasSubcommands: true,
          },
        ],
      },
    );
  },
});
//#endregion
export { cli_metadata_default as default };
