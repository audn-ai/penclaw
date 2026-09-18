import { t as resolveCliArgvInvocation } from "./argv-invocation-BjvIqM-C.js";
import { x as loadPrivateQaCliModule, y as getSubCliEntries$1 } from "./argv-zTv4_Dzq.js";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-CHhtag3S.js";
import {
  i as shouldRegisterPrimarySubcommandOnly,
  n as shouldEagerRegisterSubcommands,
} from "./command-registration-policy-BG3v7CNP.js";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import {
  i as registerCommandGroups,
  r as registerCommandGroupByName,
} from "./register-command-groups-W3gMYG31.js";
//#region src/cli/program/command-group-descriptors.ts
function buildDescriptorIndex(descriptors) {
  return new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));
}
/** Resolve named command-group specs into descriptor-backed entries. */
function resolveCommandGroupEntries(descriptors, specs) {
  const descriptorsByName = buildDescriptorIndex(descriptors);
  return specs.map((spec) => ({
    placeholders: spec.commandNames.map((name) => {
      const descriptor = descriptorsByName.get(name);
      if (!descriptor) throw new Error(`Unknown command descriptor: ${name}`);
      return descriptor;
    }),
    register: spec.register,
  }));
}
/** Build lazy command-group entries with a mapped program registrar. */
function buildCommandGroupEntries(descriptors, specs, mapRegister) {
  return resolveCommandGroupEntries(descriptors, specs).map((entry) => ({
    placeholders: entry.placeholders,
    register: mapRegister(entry.register),
  }));
}
/** Define a lazy group that imports its module at registration time. */
function defineImportedCommandGroupSpec(commandNames, loadModule, register) {
  return {
    commandNames,
    register: async (args) => {
      await register(await loadModule(), args);
    },
  };
}
/** Map program-level imported command definitions to lazy specs with export validation. */
function defineImportedProgramCommandGroupSpecs(definitions) {
  return definitions.map((definition) => ({
    commandNames: definition.commandNames,
    register: async (program) => {
      const register = (await definition.loadModule())[definition.exportName];
      if (typeof register !== "function")
        throw new Error(`Missing program command registrar: ${definition.exportName}`);
      await register(program);
    },
  }));
}
//#endregion
//#region src/cli/program/register.subclis-core.ts
const pluginCliLoader = createLazyImportLoader(() => import("./cli-7HKqAFzS.js"));
function shouldRegisterGatewayRunOnly(name, argv) {
  if (name !== "gateway") return false;
  const invocation = resolveCliArgvInvocation(argv);
  if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
  return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
  const { addGatewayRunCommand } = await import("./run-command-BvQ0sjkQ.js");
  removeCommandByName(program, "gateway");
  addGatewayRunCommand(
    addGatewayRunCommand(
      program.command("gateway").description("Run, inspect, and query the WebSocket Gateway"),
    )
      .command("run")
      .description("Run the WebSocket Gateway (foreground)"),
  );
}
async function registerSubCliWithPluginCommands(program, argv, registerSubCli, pluginCliPosition) {
  const invocation = resolveCliArgvInvocation(argv);
  const shouldRegisterPluginCommands =
    !invocation.hasHelpOrVersion &&
    resolveCliCommandPathPolicy(invocation.commandPath).loadPlugins !== "never";
  if (pluginCliPosition === "before" && shouldRegisterPluginCommands) {
    const { registerPluginCliCommandsFromValidatedConfig } = await pluginCliLoader.load();
    await registerPluginCliCommandsFromValidatedConfig(program);
  }
  await registerSubCli();
  if (pluginCliPosition === "after" && shouldRegisterPluginCommands) {
    const { registerPluginCliCommandsFromValidatedConfig } = await pluginCliLoader.load();
    await registerPluginCliCommandsFromValidatedConfig(program);
  }
}
const entrySpecs = [
  ...defineImportedProgramCommandGroupSpecs([
    {
      commandNames: ["acp"],
      loadModule: () => import("./acp-cli-P4kMp_LO.js"),
      exportName: "registerAcpCli",
    },
    {
      commandNames: ["gateway"],
      loadModule: () => import("./gateway-cli-fJZpL_vs.js"),
      exportName: "registerGatewayCli",
    },
    {
      commandNames: ["daemon"],
      loadModule: () => import("./cli/daemon-cli.js"),
      exportName: "registerDaemonCli",
    },
    {
      commandNames: ["logs"],
      loadModule: () => import("./logs-cli-Cdyncdma.js"),
      exportName: "registerLogsCli",
    },
    {
      commandNames: ["system"],
      loadModule: () => import("./system-cli-CxYvGdn8.js"),
      exportName: "registerSystemCli",
    },
    {
      commandNames: ["models"],
      loadModule: () => import("./models-cli-C1pflyZH.js"),
      exportName: "registerModelsCli",
    },
    {
      commandNames: ["promos"],
      loadModule: () => import("./promos-cli-hLmIU88d.js"),
      exportName: "registerPromosCli",
    },
    {
      commandNames: ["infer", "capability"],
      loadModule: () => import("./capability-cli-CneN3oq5.js"),
      exportName: "registerCapabilityCli",
    },
    {
      commandNames: ["approvals", "exec-approvals"],
      loadModule: () => import("./exec-approvals-cli-DlQo00Rc.js"),
      exportName: "registerExecApprovalsCli",
    },
    {
      commandNames: ["exec-policy"],
      loadModule: () => import("./exec-policy-cli-Dz_j_8Yp.js"),
      exportName: "registerExecPolicyCli",
    },
  ]),
  {
    commandNames: ["nodes"],
    register: async (program, argv) => {
      await (await import("./nodes-cli-BFplegsX.js")).registerNodesCli(program, argv);
    },
  },
  ...defineImportedProgramCommandGroupSpecs([
    {
      commandNames: ["devices"],
      loadModule: () => import("./devices-cli-BFadoWma.js"),
      exportName: "registerDevicesCli",
    },
    {
      commandNames: ["node"],
      loadModule: () => import("./node-cli-DJCR1hAU.js"),
      exportName: "registerNodeCli",
    },
    {
      commandNames: ["worker"],
      loadModule: () => import("./worker-cli-bcvdqDGX.js"),
      exportName: "registerWorkerCli",
    },
    {
      commandNames: ["sandbox"],
      loadModule: () => import("./sandbox-cli-DTl7cBYV.js"),
      exportName: "registerSandboxCli",
    },
    {
      commandNames: ["fleet"],
      loadModule: () => import("./fleet-cli-zK_WaGsx.js"),
      exportName: "registerFleetCli",
    },
    {
      commandNames: ["worktrees"],
      loadModule: () => import("./worktrees-cli-BydiZAe6.js"),
      exportName: "registerWorktreesCli",
    },
    {
      commandNames: ["attach"],
      loadModule: () => import("./attach-cli-D1OZjj9E.js"),
      exportName: "registerAttachCli",
    },
    {
      commandNames: ["tui", "terminal", "chat"],
      loadModule: () => import("./tui-cli-BK-GzURF.js"),
      exportName: "registerTuiCli",
    },
    {
      commandNames: ["cron"],
      loadModule: () => import("./cron-cli-D-b91j90.js"),
      exportName: "registerCronCli",
    },
    {
      commandNames: ["dns"],
      loadModule: () => import("./dns-cli-CU3tIbhN.js"),
      exportName: "registerDnsCli",
    },
    {
      commandNames: ["docs"],
      loadModule: () => import("./docs-cli-k-gjsduu.js"),
      exportName: "registerDocsCli",
    },
    {
      commandNames: ["qa"],
      loadModule: loadPrivateQaCliModule,
      exportName: "registerQaLabCli",
    },
    {
      commandNames: ["proxy"],
      loadModule: () => import("./proxy-cli-DgRleAsW.js"),
      exportName: "registerProxyCli",
    },
    {
      commandNames: ["hooks"],
      loadModule: () => import("./hooks-cli-DJaR5Sgu.js"),
      exportName: "registerHooksCli",
    },
    {
      commandNames: ["webhooks"],
      loadModule: () => import("./webhooks-cli-BbM6h8Rd.js"),
      exportName: "registerWebhooksCli",
    },
    {
      commandNames: ["qr"],
      loadModule: () => import("./qr-cli-Cmg-soXC.js"),
      exportName: "registerQrCli",
    },
    {
      commandNames: ["clawbot"],
      loadModule: () => import("./clawbot-cli-CHcRiZVP.js"),
      exportName: "registerClawbotCli",
    },
  ]),
  {
    commandNames: ["pairing"],
    register: async (program, argv) => {
      await registerSubCliWithPluginCommands(
        program,
        argv,
        async () => {
          (await import("./pairing-cli-vM8cmyzg.js")).registerPairingCli(program);
        },
        "before",
      );
    },
  },
  {
    commandNames: ["plugins"],
    register: async (program, argv) => {
      await registerSubCliWithPluginCommands(
        program,
        argv,
        async () => {
          (await import("./plugins-cli-ClVACIBa.js")).registerPluginsCli(program);
        },
        "after",
      );
    },
  },
  {
    commandNames: ["channels"],
    register: async (program, argv, context) => {
      await (
        await import("./channels-cli-Bwk2V_Xu.js")
      ).registerChannelsCli(program, argv, {
        includeSetupOptions: context.purpose === "completion",
      });
    },
  },
  ...defineImportedProgramCommandGroupSpecs([
    {
      commandNames: ["directory"],
      loadModule: () => import("./directory-cli-C0dBcHdd.js"),
      exportName: "registerDirectoryCli",
    },
    {
      commandNames: ["security"],
      loadModule: () => import("./security-cli-BrhaG5sa.js"),
      exportName: "registerSecurityCli",
    },
    {
      commandNames: ["secrets"],
      loadModule: () => import("./secrets-cli-fB-eAWVN.js"),
      exportName: "registerSecretsCli",
    },
    {
      commandNames: ["skills"],
      loadModule: () => import("./skills-cli-Dpb8JFM8.js"),
      exportName: "registerSkillsCli",
    },
    {
      commandNames: ["update"],
      loadModule: () => import("./update-cli-Dvm5wI3X.js"),
      exportName: "registerUpdateCli",
    },
  ]),
];
function resolveSubCliCommandGroups(argv, context = {}) {
  const descriptors = getSubCliEntries$1();
  const descriptorNames = new Set(descriptors.map((descriptor) => descriptor.name));
  return buildCommandGroupEntries(
    descriptors,
    entrySpecs.filter((spec) => spec.commandNames.every((name) => descriptorNames.has(name))),
    (register) => async (program) => {
      await register(program, argv, context);
    },
  );
}
function getSubCliEntries() {
  return getSubCliEntries$1();
}
async function registerSubCliByName(program, name, argv = process.argv, context = {}) {
  if (shouldRegisterGatewayRunOnly(name, argv)) {
    await registerGatewayRunOnly(program);
    return true;
  }
  return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
}
function registerSubCliCommands(program, argv = process.argv) {
  const { primary } = resolveCliArgvInvocation(argv);
  registerCommandGroups(program, resolveSubCliCommandGroups(argv), {
    eager: shouldEagerRegisterSubcommands(),
    primary,
    registerPrimaryOnly: Boolean(primary && shouldRegisterPrimarySubcommandOnly(argv)),
  });
}
//#endregion
export {
  defineImportedCommandGroupSpec as a,
  buildCommandGroupEntries as i,
  registerSubCliByName as n,
  defineImportedProgramCommandGroupSpecs as o,
  registerSubCliCommands as r,
  getSubCliEntries as t,
};
