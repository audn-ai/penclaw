import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
//#region extensions/vault/index.ts
var vault_default = definePluginEntry({
  id: "vault",
  name: "Vault",
  description: "HashiCorp Vault SecretRef provider integration.",
  register(api) {
    api.registerCli(
      async ({ program, config }) => {
        const { registerVaultCommands } = await import("../../cli-DVOyZb25.js");
        registerVaultCommands({
          program,
          config,
        });
      },
      {
        descriptors: [
          {
            name: "vault",
            description: "Manage the Vault SecretRef provider integration",
            hasSubcommands: true,
          },
        ],
      },
    );
  },
});
//#endregion
export { vault_default as default };
