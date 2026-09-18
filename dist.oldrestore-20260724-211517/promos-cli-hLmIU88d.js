import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/promos-cli.ts
function registerPromosCli(program) {
  const promos = program
    .command("promos")
    .description("Discover and claim promotional model offers from ClawHub")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/promos", "docs.openclaw.ai/cli/promos")}\n`,
    );
  promos
    .command("list")
    .description("List active promotions")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const { promosListCommand } = await import("./list-ciqKOjav.js");
        await promosListCommand(opts, defaultRuntime);
      });
    });
  promos
    .command("claim")
    .description("Claim a promotion: set up provider auth and register its models")
    .argument("<slug>", "Promotion slug from `openclaw promos list`")
    .option("--api-key <key>", "Provider API key for non-interactive setup")
    .option("--set-default", "Set the promotion's suggested model as default without asking", false)
    .action(async (slug, opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const { promosClaimCommand } = await import("./claim-BY-st1U5.js");
        await promosClaimCommand(slug, opts, defaultRuntime);
      });
    });
}
//#endregion
export { registerPromosCli };
