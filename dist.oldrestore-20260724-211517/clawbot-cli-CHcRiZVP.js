import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as registerQrCli } from "./qr-cli-BOHPB-ex.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
  registerQrCli(
    program
      .command("clawbot")
      .description("Legacy clawbot command aliases")
      .addHelpText(
        "after",
        () =>
          `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`,
      ),
  );
}
//#endregion
export { registerClawbotCli };
