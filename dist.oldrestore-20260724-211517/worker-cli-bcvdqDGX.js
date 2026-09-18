//#region src/cli/worker-cli.ts
/** Register the restricted cloud worker runtime entry point. */
function registerWorkerCli(program) {
  program
    .command("worker")
    .description("Run the restricted cloud worker runtime")
    .action(async () => {
      const { runWorkerCommand } = await import("./worker-command.runtime.js");
      await runWorkerCommand({
        input: process.stdin,
        output: process.stdout,
      });
    });
}
//#endregion
export { registerWorkerCli };
