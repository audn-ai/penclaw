import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/program/register.agent-turn.ts
async function loadAgentCliCommand() {
  return (await import("./agent-via-gateway-M6ADO-1H.js")).agentCliCommand;
}
async function loadDefaultRuntime() {
  return (await import("./runtime-Dvam4E8I.js")).defaultRuntime;
}
async function loadRunCommandWithRuntime() {
  return (await import("./cli-utils-DLHoTX7D.js")).runCommandWithRuntime;
}
async function loadSetVerbose() {
  return (await import("./global-state-B4gzUAcU.js")).setVerbose;
}
/** Register `openclaw agent` for one Gateway-backed agent turn. */
function registerAgentTurnCommand(program, args) {
  program
    .command("agent")
    .description("Run an agent turn via the Gateway (use --local for embedded)")
    .option("-m, --message <text>", "Message body for the agent")
    .option("--message-file <path>", "Read the agent message body from a UTF-8 file")
    .option("-t, --to <number>", "Recipient number in E.164 used to derive the session key")
    .option("--session-key <key>", "Explicit session key (agent:<id>:<key>, or scoped to --agent)")
    .option("--session-id <id>", "Use an explicit session id")
    .option("--agent <id>", "Agent id (overrides routing bindings)")
    .option("--model <id>", "Model override for this run (provider/model or model id)")
    .option(
      "--thinking <level>",
      "Thinking level: off | minimal | low | medium | high | xhigh | adaptive | max where supported",
    )
    .option("--verbose <on|off>", "Persist agent verbose level for the session")
    .option(
      "--channel <channel>",
      `Delivery channel: ${args.agentChannelOptions} (omit to use the main session channel)`,
    )
    .option("--reply-to <target>", "Delivery target override (separate from session routing)")
    .option("--reply-channel <channel>", "Delivery channel override (separate from routing)")
    .option("--reply-account <id>", "Delivery account id override")
    .option(
      "--local",
      "Run the embedded agent locally (requires model provider API keys in your shell)",
      false,
    )
    .option("--deliver", "Send the agent's reply back to the selected channel", false)
    .option("--json", "Output result as JSON", false)
    .option(
      "--timeout <seconds>",
      "Override agent command timeout (seconds, default 600 or config value)",
    )
    .addHelpText(
      "after",
      () => `
${theme.heading("Examples:")}
${formatHelpExamples([
  ['openclaw agent --to +15555550123 --message "status update"', "Start a new session."],
  ['openclaw agent --agent ops --message "Summarize logs"', "Use a specific agent."],
  ["openclaw agent --agent ops --message-file ./task.md", "Read a multiline message file."],
  [
    'openclaw agent --session-key agent:ops:incident-42 --message "Summarize status"',
    "Target an exact session key.",
  ],
  [
    'openclaw agent --session-id 1234 --message "Summarize inbox" --thinking medium',
    "Target a session with explicit thinking level.",
  ],
  [
    'openclaw agent --to +15555550123 --message "Trace logs" --verbose on --json',
    "Enable verbose logging and JSON output.",
  ],
  ['openclaw agent --to +15555550123 --message "Summon reply" --deliver', "Deliver reply."],
  [
    'openclaw agent --agent ops --message "Generate report" --deliver --reply-channel slack --reply-to "#reports"',
    "Send reply to a different channel/target.",
  ],
])}

${theme.muted("Docs:")} ${formatDocsLink("/cli/agent", "docs.openclaw.ai/cli/agent")}`,
    )
    .action(async (opts) => {
      const verboseLevel =
        typeof opts.verbose === "string" ? normalizeLowercaseStringOrEmpty(opts.verbose) : "";
      const [defaultRuntime, runCommandWithRuntime, setVerbose, agentCliCommand] =
        await Promise.all([
          loadDefaultRuntime(),
          loadRunCommandWithRuntime(),
          loadSetVerbose(),
          loadAgentCliCommand(),
        ]);
      await runCommandWithRuntime(defaultRuntime, async () => {
        setVerbose(verboseLevel === "on");
        await agentCliCommand(opts, defaultRuntime);
      });
    });
}
//#endregion
export { registerAgentTurnCommand };
