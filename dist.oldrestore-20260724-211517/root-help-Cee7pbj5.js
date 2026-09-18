import { Command } from "commander";
import {
  D as collectUniqueCommandDescriptors,
  E as addCommandDescriptorsToProgram,
  S as getCoreCliCommandDescriptors,
  y as getSubCliEntries,
} from "./argv-zTv4_Dzq.js";
import { t as getPluginCliCommandDescriptors } from "./cli-BFFnviip.js";
import { n as formatProgramHelpOutput, t as configureProgramHelp } from "./help-BzvbbWH6.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/cli/program/root-help.ts
async function buildRootHelpProgram(renderOptions) {
  const program = new Command();
  const pluginDescriptors =
    renderOptions?.includePluginDescriptors === true || renderOptions?.config
      ? await getPluginCliCommandDescriptors(renderOptions.config, renderOptions.env, {
          pluginSdkResolution: renderOptions.pluginSdkResolution,
        })
      : [];
  configureProgramHelp(
    program,
    {
      programVersion: VERSION,
      channelOptions: [],
      messageChannelOptions: "",
      agentChannelOptions: "",
    },
    {
      commandsWithSubcommands: new Set(
        pluginDescriptors
          .filter((descriptor) => descriptor.hasSubcommands)
          .map((descriptor) => descriptor.name),
      ),
    },
  );
  addCommandDescriptorsToProgram(
    program,
    collectUniqueCommandDescriptors([
      getCoreCliCommandDescriptors(),
      getSubCliEntries(),
      pluginDescriptors,
    ]),
  );
  return program;
}
/** Render root help text for tests, docs, and command output. */
async function renderRootHelpText(renderOptions) {
  const program = await buildRootHelpProgram(renderOptions);
  let output = "";
  program.configureOutput({ writeOut: (chunk) => (output += formatProgramHelpOutput(chunk)) });
  program.outputHelp();
  return output;
}
/** Write rendered root help directly to stdout. */
async function outputRootHelp(renderOptions) {
  process.stdout.write(await renderRootHelpText(renderOptions));
}
//#endregion
export { outputRootHelp };
