import { Command, CommanderError } from "commander";
import { t as resolveCliArgvInvocation } from "./argv-invocation-BjvIqM-C.js";
import { t as configureProgramHelp } from "./help-BzvbbWH6.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/cli/setup-onboard-configure-help-fast-path.ts
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
  "setup",
  "onboard",
  "configure",
]);
function resolveSetupOnboardConfigureHelpCommand(argv) {
  const invocation = resolveCliArgvInvocation(argv);
  if (invocation.commandPath.length !== 1 || !invocation.hasHelpOrVersion) return null;
  const command = invocation.commandPath[0];
  return SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS.has(command) ? command : null;
}
function createHelpContext() {
  return {
    programVersion: VERSION,
    channelOptions: [],
    messageChannelOptions: "",
    agentChannelOptions: "last",
  };
}
async function registerHelpCommand(program, command) {
  if (command === "setup") {
    const { registerSetupCommand } = await import("./register.setup-CK4AfDIk.js");
    registerSetupCommand(program);
    return;
  }
  if (command === "onboard") {
    const { registerOnboardCommand } = await import("./register.onboard-F5Y7qr4m.js");
    registerOnboardCommand(program);
    return;
  }
  const { registerConfigureCommand } = await import("./register.configure-kKkDWV7_.js");
  registerConfigureCommand(program);
}
async function tryOutputSetupOnboardConfigureHelp(argv) {
  const command = resolveSetupOnboardConfigureHelpCommand(argv);
  if (!command) return false;
  const program = new Command();
  program.enablePositionalOptions();
  program.exitOverride();
  configureProgramHelp(program, createHelpContext());
  await registerHelpCommand(program, command);
  try {
    await program.parseAsync(argv);
  } catch (error) {
    if (!(error instanceof CommanderError)) throw error;
    process.exitCode = error.exitCode;
  }
  return true;
}
//#endregion
export { tryOutputSetupOnboardConfigureHelp };
