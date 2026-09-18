import { t as definePluginEntry } from "./plugin-entry-DzBhXPVE.js";
//#region extensions/codex/cli-metadata.ts
function registerCodexCliMetadata(api) {
  api.registerCli(
    async ({ program }) => {
      const { registerCodexSessionCli } = await import("./session-cli-CFsZ6fS1.js");
      registerCodexSessionCli(program);
    },
    {
      descriptors: [
        {
          name: "codex",
          description: "Inspect and branch from Codex sessions through the Gateway",
          hasSubcommands: true,
        },
      ],
    },
  );
}
var cli_metadata_default = definePluginEntry({
  id: "codex",
  name: "Codex",
  description: "Codex app-server harness and native session supervision.",
  register: registerCodexCliMetadata,
});
//#endregion
export { registerCodexCliMetadata as n, cli_metadata_default as t };
