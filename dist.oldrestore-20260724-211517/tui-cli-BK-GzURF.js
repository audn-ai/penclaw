import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { t as parseTimeoutMs } from "./parse-timeout-DZMZaF9B.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/tui-cli.ts
/** Attach the `tui` command plus its `terminal`/`chat` aliases to the root CLI. */
function registerTuiCli(program) {
  program
    .command("tui")
    .alias("terminal")
    .alias("chat")
    .description("Open a terminal UI connected to the Gateway")
    .option("--local", "Run against the local embedded agent runtime", false)
    .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
    .option("--token <token>", "Gateway token (if required)")
    .option("--password <password>", "Gateway password (if required)")
    .option("--tls-fingerprint <sha256>", "Expected Gateway TLS certificate fingerprint")
    .option("--session <key>", 'Session key (default: "main", or "global" when scope is global)')
    .option("--deliver", "Deliver assistant replies", false)
    .option("--thinking <level>", "Thinking level override")
    .option("--message <text>", "Send an initial message after connecting")
    .option("--timeout-ms <ms>", "Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)")
    .option("--history-limit <n>", "History entries to load", "200")
    .addHelpText(
      "after",
      () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/tui", "docs.openclaw.ai/cli/tui")}\n`,
    )
    .action(async (opts, cmd) => {
      try {
        const invokedSubcommand = cmd.parent?.args[0];
        const invokedAsLocalAlias =
          invokedSubcommand === "terminal" || invokedSubcommand === "chat";
        const isLocal = Boolean(opts.local) || invokedAsLocalAlias;
        if (isLocal && (opts.url || opts.token || opts.password || opts.tlsFingerprint))
          throw new Error(
            "--local cannot be combined with --url, --token, --password, or --tls-fingerprint",
          );
        const timeoutMs = parseTimeoutMs(opts.timeoutMs);
        if (opts.timeoutMs !== void 0 && timeoutMs === void 0)
          defaultRuntime.error(
            `warning: invalid --timeout-ms "${String(opts.timeoutMs)}"; ignoring`,
          );
        const historyLimit = parseStrictPositiveInteger(opts.historyLimit ?? "200");
        if (historyLimit === void 0) throw new Error("--history-limit must be a positive integer.");
        const { runTui } = await import("./tui-BHinJXPT.js");
        await runTui({
          local: isLocal,
          url: opts.url,
          token: opts.token,
          password: opts.password,
          tlsFingerprint: opts.tlsFingerprint,
          session: opts.session,
          deliver: Boolean(opts.deliver),
          thinking: opts.thinking,
          message: opts.message,
          timeoutMs,
          historyLimit,
          forceProcessExitOnReturn: true,
        });
      } catch (err) {
        defaultRuntime.error(String(err));
        defaultRuntime.exit(1);
      }
    });
}
//#endregion
export { registerTuiCli };
