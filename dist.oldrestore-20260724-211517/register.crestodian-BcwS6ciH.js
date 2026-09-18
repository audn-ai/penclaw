import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import { t as runCrestodianWithInference } from "./crestodian-with-inference-NJ5YcwPu.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/program/register.crestodian.ts
/** Register the Crestodian helper command and its one-shot request flags. */
function registerCrestodianCommand(program) {
  program
    .command("crestodian")
    .description("Open the ring-zero setup and repair helper")
    .option("-m, --message <text>", "Run one Crestodian request")
    .option("--yes", "Approve persistent config writes for one --message request", false)
    .option("--json", "Output startup overview as JSON", false)
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples([
          ["openclaw crestodian", "Start Crestodian after a live inference check."],
          ['openclaw crestodian -m "status"', "Run one status request."],
          [
            'openclaw crestodian -m "set default model openai/gpt-5.2" --yes',
            "Apply a typed config write.",
          ],
        ])}`,
    )
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await runCrestodianWithInference(
          {
            message: opts.message,
            yes: Boolean(opts.yes),
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });
}
//#endregion
export { registerCrestodianCommand };
