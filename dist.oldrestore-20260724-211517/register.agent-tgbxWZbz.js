import { t as hasExplicitOptions } from "./command-options-Bv6UxUlT.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { t as collectOption } from "./helpers-WGaRKVcg.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/program/register.agent.ts
const loadAgentsBindModule = createLazyRuntimeModule(
  () => import("./agents.commands.bind-DVCAzU-1.js"),
);
async function loadAgentsAddCommand() {
  return (await import("./agents.commands.add-CTUMgm0l.js")).agentsAddCommand;
}
async function loadAgentsBindCommand() {
  return (await loadAgentsBindModule()).agentsBindCommand;
}
async function loadAgentsBindingsCommand() {
  return (await loadAgentsBindModule()).agentsBindingsCommand;
}
async function loadAgentsUnbindCommand() {
  return (await loadAgentsBindModule()).agentsUnbindCommand;
}
async function loadAgentsDeleteCommand() {
  return (await import("./agents.commands.delete-9PlkM2Rw.js")).agentsDeleteCommand;
}
async function loadAgentsSetIdentityCommand() {
  return (await import("./agents.commands.identity-CSqEXKKz.js")).agentsSetIdentityCommand;
}
async function loadAgentsListCommand() {
  return (await import("./agents.commands.list-DaKhu95A.js")).agentsListCommand;
}
async function loadAgentsActionRuntime() {
  const [{ defaultRuntime }, { runCommandWithRuntime }] = await Promise.all([
    import("./runtime-Dvam4E8I.js"),
    import("./cli-utils-DLHoTX7D.js"),
  ]);
  return {
    defaultRuntime,
    runCommandWithRuntime,
  };
}
async function runAgentsCommandAction(action) {
  const { defaultRuntime, runCommandWithRuntime } = await loadAgentsActionRuntime();
  await runCommandWithRuntime(defaultRuntime, async () => {
    await action(defaultRuntime);
  });
}
/** Register `agents` management subcommands for config, bindings, identity, and deletion. */
function registerAgentsCommands(program) {
  const agents = program
    .command("agents")
    .description("Manage isolated agents (workspaces + auth + routing)")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/agents", "docs.openclaw.ai/cli/agents")}\n`,
    );
  agents
    .command("list")
    .description("List configured agents")
    .option("--json", "Output JSON instead of text", false)
    .option("--bindings", "Include routing bindings", false)
    .action(async (opts) => {
      await runAgentsCommandAction(async (runtime) => {
        await (
          await loadAgentsListCommand()
        )(
          {
            json: Boolean(opts.json),
            bindings: Boolean(opts.bindings),
          },
          runtime,
        );
      });
    });
  agents
    .command("bindings")
    .description("List routing bindings")
    .option("--agent <id>", "Filter by agent id")
    .option("--json", "Output JSON instead of text", false)
    .action(async (opts) => {
      await runAgentsCommandAction(async (runtime) => {
        await (
          await loadAgentsBindingsCommand()
        )(
          {
            agent: opts.agent,
            json: Boolean(opts.json),
          },
          runtime,
        );
      });
    });
  agents
    .command("bind")
    .description("Add routing bindings for an agent")
    .option("--agent <id>", "Agent id (defaults to current default agent)")
    .option(
      "--bind <channel[:accountId]>",
      "Binding to add (repeatable). If omitted, accountId is resolved by channel defaults/hooks.",
      collectOption,
      [],
    )
    .option("--json", "Output JSON summary", false)
    .action(async (opts) => {
      await runAgentsCommandAction(async (runtime) => {
        await (
          await loadAgentsBindCommand()
        )(
          {
            agent: opts.agent,
            bind: Array.isArray(opts.bind) ? opts.bind : void 0,
            json: Boolean(opts.json),
          },
          runtime,
        );
      });
    });
  agents
    .command("unbind")
    .description("Remove routing bindings for an agent")
    .option("--agent <id>", "Agent id (defaults to current default agent)")
    .option("--bind <channel[:accountId]>", "Binding to remove (repeatable)", collectOption, [])
    .option("--all", "Remove all bindings for this agent", false)
    .option("--json", "Output JSON summary", false)
    .action(async (opts) => {
      await runAgentsCommandAction(async (runtime) => {
        await (
          await loadAgentsUnbindCommand()
        )(
          {
            agent: opts.agent,
            bind: Array.isArray(opts.bind) ? opts.bind : void 0,
            all: Boolean(opts.all),
            json: Boolean(opts.json),
          },
          runtime,
        );
      });
    });
  agents
    .command("add [name]")
    .description("Add a new isolated agent")
    .option("--workspace <dir>", "Workspace directory for the new agent")
    .option("--model <id>", "Model id for this agent")
    .option("--agent-dir <dir>", "Agent state directory for this agent")
    .option("--bind <channel[:accountId]>", "Route channel binding (repeatable)", collectOption, [])
    .option("--non-interactive", "Disable prompts; requires --workspace", false)
    .option("--json", "Output JSON summary", false)
    .action(async (name, opts, command) => {
      await runAgentsCommandAction(async (runtime) => {
        const hasFlags = hasExplicitOptions(command, [
          "workspace",
          "model",
          "agentDir",
          "bind",
          "nonInteractive",
        ]);
        await (
          await loadAgentsAddCommand()
        )(
          {
            name: typeof name === "string" ? name : void 0,
            workspace: opts.workspace,
            model: opts.model,
            agentDir: opts.agentDir,
            bind: Array.isArray(opts.bind) ? opts.bind : void 0,
            nonInteractive: Boolean(opts.nonInteractive),
            json: Boolean(opts.json),
          },
          runtime,
          { hasFlags },
        );
      });
    });
  agents
    .command("set-identity")
    .description("Update an agent identity (name/theme/emoji/avatar)")
    .option("--agent <id>", "Agent id to update")
    .option("--workspace <dir>", "Workspace directory used to locate the agent + IDENTITY.md")
    .option("--identity-file <path>", "Explicit IDENTITY.md path to read")
    .option("--from-identity", "Read values from IDENTITY.md", false)
    .option("--name <name>", "Identity name")
    .option("--theme <theme>", "Identity theme")
    .option("--emoji <emoji>", "Identity emoji")
    .option("--avatar <value>", "Identity avatar (workspace path, http(s) URL, or data URI)")
    .option("--json", "Output JSON summary", false)
    .addHelpText(
      "after",
      () => `
${theme.heading("Examples:")}
${formatHelpExamples([
  ['openclaw agents set-identity --agent main --name "OpenClaw" --emoji "🦞"', "Set name + emoji."],
  ["openclaw agents set-identity --agent main --avatar avatars/openclaw.png", "Set avatar path."],
  [
    "openclaw agents set-identity --workspace ~/.openclaw/workspace --from-identity",
    "Load from IDENTITY.md.",
  ],
  [
    "openclaw agents set-identity --identity-file ~/.openclaw/workspace/IDENTITY.md --agent main",
    "Use a specific IDENTITY.md.",
  ],
])}
`,
    )
    .action(async (opts) => {
      await runAgentsCommandAction(async (runtime) => {
        await (
          await loadAgentsSetIdentityCommand()
        )(
          {
            agent: opts.agent,
            workspace: opts.workspace,
            identityFile: opts.identityFile,
            fromIdentity: Boolean(opts.fromIdentity),
            name: opts.name,
            theme: opts.theme,
            emoji: opts.emoji,
            avatar: opts.avatar,
            json: Boolean(opts.json),
          },
          runtime,
        );
      });
    });
  agents
    .command("delete <id>")
    .description("Delete an agent and prune workspace/state")
    .option("--force", "Skip confirmation", false)
    .option("--json", "Output JSON summary", false)
    .action(async (id, opts) => {
      await runAgentsCommandAction(async (runtime) => {
        await (
          await loadAgentsDeleteCommand()
        )(
          {
            id: String(id),
            force: Boolean(opts.force),
            json: Boolean(opts.json),
          },
          runtime,
        );
      });
    });
  agents.action(async () => {
    await runAgentsCommandAction(async (runtime) => {
      await (
        await loadAgentsListCommand()
      )({}, runtime);
    });
  });
}
//#endregion
export { registerAgentsCommands };
