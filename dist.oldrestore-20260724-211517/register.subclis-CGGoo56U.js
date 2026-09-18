import { t as resolveCliArgvInvocation } from "./argv-invocation-BjvIqM-C.js";
import { y as getSubCliEntries } from "./argv-zTv4_Dzq.js";
import {
  i as shouldRegisterPrimarySubcommandOnly,
  n as shouldEagerRegisterSubcommands,
} from "./command-registration-policy-BG3v7CNP.js";
import {
  i as registerCommandGroups,
  r as registerCommandGroupByName,
} from "./register-command-groups-W3gMYG31.js";
import {
  i as buildCommandGroupEntries,
  n as registerSubCliByName$1,
  o as defineImportedProgramCommandGroupSpecs,
  r as registerSubCliCommands$1,
} from "./register.subclis-core-BGVLtbTc.js";
//#region src/cli/program/register.subclis.ts
const entrySpecs = [
  ...defineImportedProgramCommandGroupSpecs([
    {
      commandNames: ["completion"],
      loadModule: () => import("./completion-cli-CQg7296H.js"),
      exportName: "registerCompletionCli",
    },
  ]),
];
function resolveSubCliCommandGroups(argv, context = {}) {
  return buildCommandGroupEntries(getSubCliEntries(), entrySpecs, (register) => async (program) => {
    await register(program, argv, context);
  });
}
/** Register one sub-CLI by name, including lazy command groups. */
async function registerSubCliByName(program, name, argv = process.argv, context = {}) {
  if (await registerSubCliByName$1(program, name, argv, context)) return true;
  return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
}
/** Register sub-CLI commands according to eager/lazy startup policy. */
function registerSubCliCommands(program, argv = process.argv) {
  registerSubCliCommands$1(program, argv);
  const { primary } = resolveCliArgvInvocation(argv);
  registerCommandGroups(program, resolveSubCliCommandGroups(argv), {
    eager: shouldEagerRegisterSubcommands(),
    primary,
    registerPrimaryOnly: Boolean(primary && shouldRegisterPrimarySubcommandOnly(argv)),
  });
}
//#endregion
export { registerSubCliCommands as n, registerSubCliByName as t };
