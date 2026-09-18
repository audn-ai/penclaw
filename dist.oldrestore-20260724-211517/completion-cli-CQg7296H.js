import fs from "node:fs/promises";
import path from "node:path";
import { Option } from "commander";
import {
  n as registerCoreCliByName,
  t as getCoreCliCommandNames,
} from "./command-registry-core-X9-01_Zb.js";
import {
  a as installCompletion,
  c as resolveCompletionCachePath,
  s as isCompletionShell,
  t as COMPLETION_SHELLS,
  u as resolveShellFromEnv,
} from "./completion-runtime-Ck51_Qqg.js";
import { a as routeLogsToStderr } from "./console-CspqtrUy.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as getProgramContext } from "./program-context-VEhF8JxS.js";
import {
  n as registerSubCliByName,
  t as getSubCliEntries,
} from "./register.subclis-core-BGVLtbTc.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/completion-fish.ts
function escapeFishDescription(value) {
  return value.replace(/'/g, "'\\''");
}
function parseOptionFlags(flags) {
  const parts = flags.split(/[ ,|]+/);
  return {
    long: parts.find((flag) => flag.startsWith("--"))?.replace(/^--/, ""),
    short: parts.find((flag) => flag.startsWith("-") && !flag.startsWith("--"))?.replace(/^-/, ""),
  };
}
function buildFishSubcommandCompletionLine(params) {
  const desc = escapeFishDescription(params.description);
  return `complete -c ${params.rootCmd} -n "${params.condition}" -a "${params.name}" -d '${desc}'\n`;
}
function buildFishOptionCompletionLine(params) {
  const { short, long } = parseOptionFlags(params.flags);
  const desc = escapeFishDescription(params.description);
  let line = `complete -c ${params.rootCmd} -n "${params.condition}"`;
  if (short) line += ` -s ${short}`;
  if (long) line += ` -l ${long}`;
  line += ` -d '${desc}'\n`;
  return line;
}
//#endregion
//#region src/cli/completion-cli.ts
function getCompletionScript(shell, program) {
  if (shell === "zsh") return generateZshCompletion(program);
  if (shell === "bash") return generateBashCompletion(program);
  if (shell === "powershell") return generatePowerShellCompletion(program);
  return generateFishCompletion(program);
}
function splitOptionFlags(flags) {
  return flags.split(/[ ,|]+/u).filter(Boolean);
}
function preferredCompletionFlag(flags) {
  const parts = splitOptionFlags(flags);
  return parts.find((flag) => flag.startsWith("--")) ?? parts[0] ?? flags;
}
function fishWords(values) {
  return values.join(" ");
}
function completionOptionFlags(options, wantsValue) {
  return options.flatMap((option) => {
    if ((option.required || option.optional) !== wantsValue) return [];
    return splitOptionFlags(option.flags).filter((flag) => flag.startsWith("-"));
  });
}
function commandNameVariants(cmd) {
  return [cmd.name(), ...cmd.aliases()];
}
function childPathVariants(parentVariants, sub) {
  return parentVariants.flatMap((parents) =>
    commandNameVariants(sub).map((name) => parents.concat(name)),
  );
}
function collectFishPathOptionFlags(program, parents, wantsValue) {
  const flags = new Set(completionOptionFlags(program.options, wantsValue));
  let current = program;
  for (const name of parents) {
    current = current?.commands.find((cmd) => commandNameVariants(cmd).includes(name));
    if (!current) break;
    for (const flag of completionOptionFlags(current.options, wantsValue)) flags.add(flag);
  }
  return [...flags];
}
function generateFishPathHelper(rootCmd) {
  return `
function __${rootCmd}_command_path_matches
  set -l expected
  set -l value_options
  set -l reading_value_options 0
  for arg in $argv
    if test "$arg" = "--"
      set reading_value_options 1
      continue
    end
    if test $reading_value_options -eq 1
      set -a value_options $arg
    else
      set -a expected $arg
    end
  end
  set -l tokens (commandline -opc)
  set -e tokens[1]
  set -l command_tokens
  set -l skip_next 0
  for token in $tokens
    if test $skip_next -eq 1
      set skip_next 0
      continue
    end
    set -l flag (string split -m1 "=" -- $token)[1]
    if contains -- $flag $value_options
      if not string match -q -- "*=*" $token
        set skip_next 1
      end
      continue
    end
    if string match -q -- "-*" $token
      continue
    end
    set -a command_tokens $token
  end
  for i in (seq (count $expected))
    if test "$command_tokens[$i]" != "$expected[$i]"
      return 1
    end
  end
  return 0
end
`;
}
function fishCommandPathCondition(program, rootCmd, parents) {
  const valueOptions = collectFishPathOptionFlags(program, parents, true);
  return `__${rootCmd}_command_path_matches ${parents.join(" ")} -- ${fishWords(valueOptions)}`.trimEnd();
}
async function writeCompletionCache(params) {
  const firstShell = params.shells[0] ?? "zsh";
  const cacheDir = path.dirname(resolveCompletionCachePath(firstShell, params.binName));
  await fs.mkdir(cacheDir, { recursive: true });
  for (const shell of params.shells) {
    const script = getCompletionScript(shell, params.program);
    const targetPath = resolveCompletionCachePath(shell, params.binName);
    await fs.writeFile(targetPath, script, "utf-8");
  }
}
function writeCompletionRegistrationWarning(message) {
  process.stderr.write(`[completion] ${message}\n`);
}
async function registerSubcommandsForCompletion(program) {
  const entries = getSubCliEntries();
  for (const entry of entries) {
    if (entry.name === "completion") continue;
    try {
      await registerSubCliByName(program, entry.name, process.argv, { purpose: "completion" });
    } catch (error) {
      writeCompletionRegistrationWarning(
        `skipping subcommand \`${entry.name}\` while building completion cache: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
function registerCompletionCli(program) {
  program
    .command("completion")
    .description("Generate shell completion script")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/completion", "docs.openclaw.ai/cli/completion")}\n`,
    )
    .addOption(
      new Option("-s, --shell <shell>", "Shell to generate completion for (default: zsh)").choices(
        COMPLETION_SHELLS,
      ),
    )
    .option("-i, --install", "Install completion script to shell profile")
    .option(
      "--write-state",
      "Write completion scripts to $OPENCLAW_STATE_DIR/completions (no stdout)",
    )
    .option("-y, --yes", "Skip confirmation (non-interactive)", false)
    .action(async (options) => {
      routeLogsToStderr();
      const shell = options.shell ?? "zsh";
      const ctx = getProgramContext(program);
      if (ctx)
        for (const name of getCoreCliCommandNames())
          await registerCoreCliByName(program, ctx, name);
      await registerSubcommandsForCompletion(program);
      if (process.env["OPENCLAW_COMPLETION_SKIP_PLUGIN_COMMANDS"] !== "1") {
        const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-7HKqAFzS.js");
        await registerPluginCliCommandsFromValidatedConfig(program, void 0, void 0, {
          mode: "eager",
        });
      }
      if (options.writeState)
        await writeCompletionCache({
          program,
          shells: options.shell ? [shell] : [...COMPLETION_SHELLS],
          binName: program.name(),
        });
      if (options.install) {
        await installCompletion(
          options.shell ?? resolveShellFromEnv(),
          Boolean(options.yes),
          program.name(),
        );
        return;
      }
      if (options.writeState) return;
      if (!isCompletionShell(shell)) throw new Error(`Unsupported shell: ${shell}`);
      const script = getCompletionScript(shell, program);
      process.stdout.write(script + "\n");
    });
}
function generateZshCompletion(program) {
  const rootCmd = program.name();
  return `
#compdef ${rootCmd}

_${rootCmd}_root_completion() {
  local -a commands
  local -a options
  
  _arguments -C \\
    ${generateZshArgs(program)} \\
    ${generateZshSubcmdList(program)} \\
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        ${program.commands.map((cmd) => `(${commandNameVariants(cmd).join("|")}) _${rootCmd}_${cmd.name().replace(/-/g, "_")} ;;`).join("\n        ")}
      esac
      ;;
  esac
}

${generateZshSubcommands(program, rootCmd)}

_${rootCmd}_register_completion() {
  if (( ! $+functions[compdef] )); then
    return 0
  fi

  compdef _${rootCmd}_root_completion ${rootCmd}
  precmd_functions=(\${precmd_functions:#_${rootCmd}_register_completion})
  unfunction _${rootCmd}_register_completion 2>/dev/null
}

_${rootCmd}_register_completion
if (( ! $+functions[compdef] )); then
  typeset -ga precmd_functions
  if [[ -z "\${precmd_functions[(r)_${rootCmd}_register_completion]}" ]]; then
    precmd_functions+=(_${rootCmd}_register_completion)
  fi
fi
`;
}
function generateZshArgs(cmd) {
  return (cmd.options || [])
    .map((opt) => {
      const flags = opt.flags.split(/[ ,|]+/);
      const name = flags.find((f) => f.startsWith("--")) || flags[0];
      const short = flags.find((f) => f.startsWith("-") && !f.startsWith("--"));
      const desc = escapeZshDoubleQuotedDescription(opt.description);
      if (short) return `"(${name} ${short})"{${name},${short}}"[${desc}]"`;
      return `"${name}[${desc}]"`;
    })
    .join(" \\\n    ");
}
function generateZshSubcmdList(cmd) {
  return `"1: :_values 'command' ${cmd.commands
    .flatMap((c) => {
      const desc = c
        .description()
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "'\\''")
        .replace(/\[/g, "\\[")
        .replace(/\]/g, "\\]");
      return commandNameVariants(c).map((name) => `'${name}[${desc}]'`);
    })
    .join(" ")}"`;
}
function escapeZshDoubleQuotedDescription(description) {
  return description
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\$/g, "\\$")
    .replaceAll("`", "\\`")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]");
}
function generateZshSubcommands(program, prefix) {
  const segments = [];
  const visit = (current, currentPrefix) => {
    for (const cmd of current.commands) {
      const nextPrefix = `${currentPrefix}_${cmd.name().replace(/-/g, "_")}`;
      const funcName = `_${nextPrefix}`;
      visit(cmd, nextPrefix);
      const subCommands = cmd.commands;
      if (subCommands.length > 0) {
        segments.push(`
${funcName}() {
  local -a commands
  local -a options
  
  _arguments -C \\
    ${generateZshArgs(cmd)} \\
    ${generateZshSubcmdList(cmd)} \\
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        ${subCommands.map((sub) => `(${commandNameVariants(sub).join("|")}) ${funcName}_${sub.name().replace(/-/g, "_")} ;;`).join("\n        ")}
      esac
      ;;
  esac
}
`);
        continue;
      }
      segments.push(`
${funcName}() {
  _arguments -C \\
    ${generateZshArgs(cmd)}
}
`);
    }
  };
  visit(program, prefix);
  return segments.join("");
}
function generateBashCompletion(program) {
  const rootCmd = program.name();
  const rootCompletions = [
    ...program.commands.flatMap((command) => commandNameVariants(command)),
    ...program.options.map((option) => preferredCompletionFlag(option.flags)),
  ];
  const rootValueOptions = completionOptionFlags(program.options, true);
  const commandPathUpdate = generateBashCommandPathUpdate(
    collectBashCompletionContexts(program, rootValueOptions),
  );
  return `
_${rootCmd}_completion() {
    local cur opts command_path candidate_path value_options word flag i
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    opts="${rootCompletions.join(" ")}"
    value_options="${rootValueOptions.join(" ")}"
    command_path=""

    for ((i = 1; i < COMP_CWORD; i++)); do
        word="\${COMP_WORDS[i]}"
        if [[ \${word} == -* ]]; then
            flag="\${word%%=*}"
            if [[ \${word} != *=* && " \${value_options} " == *" \${flag} "* ]]; then
                i=$((i + 1))
            fi
            continue
        fi

        if [[ -n "\${command_path}" ]]; then
            candidate_path="\${command_path} \${word}"
        else
            candidate_path="\${word}"
        fi

${commandPathUpdate}
    done

    COMPREPLY=( $(compgen -W "\${opts}" -- \${cur}) )
}

complete -F _${rootCmd}_completion ${rootCmd}
`;
}
function collectBashCompletionContexts(program, rootValueOptions) {
  const contexts = [];
  const visit = (cmd, pathVariants, inheritedValueOptions) => {
    const completions = [
      ...cmd.commands.flatMap((command) => commandNameVariants(command)),
      ...cmd.options.map((option) => preferredCompletionFlag(option.flags)),
    ];
    const valueOptions = [
      .../* @__PURE__ */ new Set([
        ...inheritedValueOptions,
        ...completionOptionFlags(cmd.options, true),
      ]),
    ];
    contexts.push({
      pathVariants,
      completions,
      valueOptions,
    });
    for (const sub of cmd.commands) visit(sub, childPathVariants(pathVariants, sub), valueOptions);
  };
  for (const sub of program.commands) visit(sub, childPathVariants([[]], sub), rootValueOptions);
  return contexts;
}
function generateBashCompletionContextCases(contexts) {
  return contexts
    .map((context) => {
      return `              ${context.pathVariants.map((commandPath) => `"${commandPath.join(" ")}"`).join("|")})
                opts="${context.completions.join(" ")}"
                value_options="${context.valueOptions.join(" ")}"
                ;;`;
    })
    .join("\n");
}
function generateBashCommandPathUpdate(contexts) {
  if (contexts.length === 0) return "";
  return `        case "\${candidate_path}" in
          ${contexts
            .flatMap((context) => context.pathVariants)
            .map((commandPath) => `"${commandPath.join(" ")}"`)
            .join("|")})
            command_path="\${candidate_path}"
            case "\${command_path}" in
${generateBashCompletionContextCases(contexts)}
            esac
            ;;
        esac`;
}
function generatePowerShellCompletion(program) {
  const rootCmd = program.name();
  const segments = [];
  const formatPowerShellArray = (entries) =>
    entries.length > 0 ? `@(${entries.map((entry) => `'${entry}'`).join(",")})` : "@()";
  const visit = (cmd, pathVariants) => {
    const subCommands = cmd.commands.flatMap((c) => commandNameVariants(c));
    const options = cmd.options.map((o) => preferredCompletionFlag(o.flags));
    const allCompletions = formatPowerShellArray([...subCommands, ...options]);
    if ([...subCommands, ...options].length > 0)
      for (const pathSegments of pathVariants) {
        const fullPath = pathSegments.join(" ");
        if (fullPath.length === 0) continue;
        segments.push(`
            if ($commandPath -eq '${fullPath}') {
                $completions = ${allCompletions}
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }
`);
      }
    for (const sub of cmd.commands) visit(sub, childPathVariants(pathVariants, sub));
  };
  visit(program, [[]]);
  const rootBody = segments.join("");
  return `
Register-ArgumentCompleter -Native -CommandName ${rootCmd} -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    $commandElements = $commandAst.CommandElements
    $commandPath = ""
    
    # Reconstruct command path (simple approximation)
    # Skip the executable name
    for ($i = 1; $i -lt $commandElements.Count; $i++) {
        $element = $commandElements[$i].Extent.Text
        if ($element -like "-*") { break }
        if ($i -eq $commandElements.Count - 1 -and $wordToComplete -ne "") { break } # Don't include current word being typed
        $commandPath += "$element "
    }
    $commandPath = $commandPath.Trim()
    
    # Root command
    if ($commandPath -eq "") {
         $completions = ${formatPowerShellArray([...program.commands.flatMap((command) => commandNameVariants(command)), ...program.options.map((option) => preferredCompletionFlag(option.flags))])}
         $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
         }
    }
    
    ${rootBody}
}
`;
}
function generateFishCompletion(program) {
  const rootCmd = program.name();
  const segments = [generateFishPathHelper(rootCmd)];
  const visit = (cmd, parentVariants) => {
    const conditions = parentVariants.map((parents) =>
      parents.length === 0
        ? "__fish_use_subcommand"
        : fishCommandPathCondition(program, rootCmd, parents),
    );
    for (const condition of conditions) {
      for (const sub of cmd.commands)
        for (const name of commandNameVariants(sub))
          segments.push(
            buildFishSubcommandCompletionLine({
              rootCmd,
              condition,
              name,
              description: sub.description(),
            }),
          );
      for (const opt of cmd.options)
        segments.push(
          buildFishOptionCompletionLine({
            rootCmd,
            condition,
            flags: opt.flags,
            description: opt.description,
          }),
        );
    }
    for (const sub of cmd.commands) visit(sub, childPathVariants(parentVariants, sub));
  };
  visit(program, [[]]);
  return segments.join("");
}
//#endregion
export { getCompletionScript, registerCompletionCli };
