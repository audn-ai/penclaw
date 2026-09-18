import { t as resolveCliArgvInvocation } from "./argv-invocation-BjvIqM-C.js";
import {
  C as getCoreCliCommandNames$1,
  S as getCoreCliCommandDescriptors,
} from "./argv-zTv4_Dzq.js";
import { r as shouldRegisterPrimaryCommandOnly } from "./command-registration-policy-BG3v7CNP.js";
import {
  i as registerCommandGroups,
  r as registerCommandGroupByName,
} from "./register-command-groups-W3gMYG31.js";
import {
  a as defineImportedCommandGroupSpec,
  i as buildCommandGroupEntries,
  o as defineImportedProgramCommandGroupSpecs,
} from "./register.subclis-core-BGVLtbTc.js";
//#region src/cli/program/command-registry-core.ts
function withProgramOnlySpecs(specs) {
  return specs.map((spec) => ({
    commandNames: spec.commandNames,
    register: async ({ program }) => {
      await spec.register(program);
    },
  }));
}
const coreEntrySpecs = [
  ...withProgramOnlySpecs(
    defineImportedProgramCommandGroupSpecs([
      {
        commandNames: ["crestodian"],
        loadModule: () => import("./register.crestodian-BcwS6ciH.js"),
        exportName: "registerCrestodianCommand",
      },
      {
        commandNames: ["setup"],
        loadModule: () => import("./register.setup-CK4AfDIk.js"),
        exportName: "registerSetupCommand",
      },
      {
        commandNames: ["onboard"],
        loadModule: () => import("./register.onboard-F5Y7qr4m.js"),
        exportName: "registerOnboardCommand",
      },
      {
        commandNames: ["configure"],
        loadModule: () => import("./register.configure-kKkDWV7_.js"),
        exportName: "registerConfigureCommand",
      },
      {
        commandNames: ["config"],
        loadModule: () => import("./config-cli-Dsa4PXNC.js"),
        exportName: "registerConfigCli",
      },
      {
        commandNames: ["backup"],
        loadModule: () => import("./register.backup-CbZ5fsZU.js"),
        exportName: "registerBackupCommand",
      },
      {
        commandNames: ["migrate"],
        loadModule: () => import("./register.migrate-Bp8-CRJ_.js"),
        exportName: "registerMigrateCommand",
      },
      {
        commandNames: ["audit"],
        loadModule: () => import("./register.audit-CdCoqnvq.js"),
        exportName: "registerAuditCommand",
      },
      {
        commandNames: ["doctor", "dashboard", "reset", "uninstall"],
        loadModule: () => import("./register.maintenance-LIz7lYDf.js"),
        exportName: "registerMaintenanceCommands",
      },
    ]),
  ),
  defineImportedCommandGroupSpec(
    ["message"],
    () => import("./register.message-BO4aNTOF.js"),
    (mod, { program, ctx }) => {
      mod.registerMessageCommands(program, ctx);
    },
  ),
  ...withProgramOnlySpecs(
    defineImportedProgramCommandGroupSpecs([
      {
        commandNames: ["mcp"],
        loadModule: () => import("./mcp-cli-BwaJpYYu.js"),
        exportName: "registerMcpCli",
      },
      {
        commandNames: ["transcripts"],
        loadModule: () => import("./register.transcripts-2ZYqVFHM.js"),
        exportName: "registerTranscriptsCli",
      },
    ]),
  ),
  defineImportedCommandGroupSpec(
    ["agent"],
    () => import("./register.agent-turn-Bs10Ujn9.js"),
    (mod, { program, ctx }) => {
      mod.registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions });
    },
  ),
  defineImportedCommandGroupSpec(
    ["agents"],
    () => import("./register.agent-tgbxWZbz.js"),
    (mod, { program }) => {
      mod.registerAgentsCommands(program);
    },
  ),
  ...withProgramOnlySpecs(
    defineImportedProgramCommandGroupSpecs([
      {
        commandNames: ["status", "health", "sessions", "commitments", "tasks"],
        loadModule: () => import("./register.status-health-sessions-B0kxNEWe.js"),
        exportName: "registerStatusHealthSessionsCommands",
      },
    ]),
  ),
];
function resolveCoreCommandGroups(ctx, argv) {
  return buildCommandGroupEntries(
    getCoreCliCommandDescriptors(),
    coreEntrySpecs,
    (register) => async (program) => {
      await register({
        program,
        ctx,
        argv,
      });
    },
  );
}
function getCoreCliCommandNames() {
  return getCoreCliCommandNames$1();
}
async function registerCoreCliByName(program, ctx, name, argv = process.argv) {
  return registerCommandGroupByName(program, resolveCoreCommandGroups(ctx, argv), name);
}
function registerCoreCliCommands(program, ctx, argv) {
  const { primary } = resolveCliArgvInvocation(argv);
  registerCommandGroups(program, resolveCoreCommandGroups(ctx, argv), {
    eager: false,
    primary,
    registerPrimaryOnly: Boolean(primary && shouldRegisterPrimaryCommandOnly(argv)),
  });
}
//#endregion
export { registerCoreCliByName as n, registerCoreCliCommands as r, getCoreCliCommandNames as t };
