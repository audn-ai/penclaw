import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import { n as CONFIGURE_WIZARD_SECTIONS } from "./configure.shared-BaORZxEM.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/program/register.configure.ts
/** Register the interactive `configure` command and section filter flag. */
function registerConfigureCommand(program) {
  program
    .command("configure")
    .description("Interactive configuration for credentials, channels, gateway, and agent defaults")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/configure", "docs.openclaw.ai/cli/configure")}\n`,
    )
    .option(
      "--section <section>",
      `Configuration sections (repeatable). Options: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}`,
      (value, previous) => [...previous, value],
      [],
    )
    .action(async (opts) => {
      const { defaultRuntime } = await import("./runtime-Dvam4E8I.js");
      await runCommandWithRuntime(defaultRuntime, async () => {
        const { configureCommandFromSectionsArg } =
          await import("./configure.commands-CqcBAjae.js");
        await configureCommandFromSectionsArg(opts.section, defaultRuntime);
      });
    });
}
//#endregion
export { registerConfigureCommand };
