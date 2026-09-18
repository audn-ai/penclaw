import { t as buildParseArgv } from "./argv-zTv4_Dzq.js";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.js";
//#region src/cli/program/action-reparse.ts
function getCommandPathFromRoot(command) {
  const path = [];
  let current = command;
  while (current?.parent) {
    if (current.name()) path.unshift(current);
    current = current.parent;
  }
  return path;
}
function findRootCommand(cmd) {
  let current = cmd;
  while (current.parent) current = current.parent;
  return current;
}
function findOption(command, token) {
  const equalsIndex = token.indexOf("=");
  const flag = equalsIndex === -1 ? token : token.slice(0, equalsIndex);
  return command.options.find(
    (candidate) =>
      (candidate.short === flag || candidate.long === flag) &&
      (equalsIndex === -1 || candidate.required || candidate.optional),
  );
}
function findNearestOption(commands, token) {
  for (let index = commands.length - 1; index >= 0; index -= 1) {
    const command = commands[index];
    const option = command ? findOption(command, token) : void 0;
    if (option) return option;
  }
}
function matchesCommandName(command, token) {
  return command.name() === token || command.aliases().includes(token);
}
function optionTokenCount(option, argv, index) {
  if ((argv[index] ?? "").includes("=") || (!option.required && !option.optional)) return 1;
  const next = argv[index + 1];
  if (option.required) return next === void 0 ? 0 : 2;
  return next && (!next.startsWith("-") || /^-\d/.test(next)) ? 2 : 1;
}
function findCommandPathEnd(argv, command) {
  const path = getCommandPathFromRoot(command);
  const root = path[0]?.parent;
  if (!root) return -1;
  const selectedCommands = [root];
  let pathIndex = 0;
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index] ?? "";
    const option = findNearestOption(selectedCommands, token);
    if (option) {
      const count = optionTokenCount(option, argv, index);
      if (count === 0) return -1;
      index += count - 1;
      continue;
    }
    const nextCommand = path[pathIndex];
    if (!nextCommand || !matchesCommandName(nextCommand, token)) return -1;
    selectedCommands.push(nextCommand);
    pathIndex += 1;
    if (pathIndex === path.length) return index + 1;
  }
  return -1;
}
/** Restore parent-option placement without stealing options owned by the loaded child command. */
function hoistLazyParentOptions(argv, parentCommand, lazyCommandName) {
  let lazyCommandIndex = findCommandPathEnd(argv, parentCommand);
  if (lazyCommandIndex === -1) return argv;
  while (lazyCommandIndex < argv.length) {
    const option = findOption(parentCommand, argv[lazyCommandIndex] ?? "");
    if (!option) break;
    const count = optionTokenCount(option, argv, lazyCommandIndex);
    if (count === 0) return argv;
    lazyCommandIndex += count;
  }
  if (argv[lazyCommandIndex] !== lazyCommandName) return argv;
  const lazyCommand = parentCommand.commands.find((command) =>
    matchesCommandName(command, lazyCommandName),
  );
  if (!lazyCommand) return argv;
  let selectedCommand = lazyCommand;
  const selectedCommands = [selectedCommand];
  const hoisted = [];
  const remaining = [];
  let acceptsSubcommands = true;
  for (let index = lazyCommandIndex + 1; index < argv.length; index += 1) {
    const token = argv[index] ?? "";
    if (token === "--") {
      remaining.push(...argv.slice(index));
      break;
    }
    const childOption = findNearestOption(selectedCommands, token);
    const parentOption = findOption(parentCommand, token);
    const option = childOption ?? parentOption;
    if (option) {
      const count = optionTokenCount(option, argv, index);
      if (count === 0) return argv;
      const tokens = argv.slice(index, index + count);
      (childOption ? remaining : hoisted).push(...tokens);
      index += count - 1;
      continue;
    }
    if (acceptsSubcommands && !token.startsWith("-")) {
      const nextCommand = selectedCommand.commands.find((command) =>
        matchesCommandName(command, token),
      );
      if (nextCommand) {
        selectedCommand = nextCommand;
        selectedCommands.push(nextCommand);
      } else acceptsSubcommands = false;
    }
    remaining.push(token);
  }
  return hoisted.length === 0
    ? argv
    : [...argv.slice(0, lazyCommandIndex), ...hoisted, lazyCommandName, ...remaining];
}
/** Re-run parsing after replacing a lazy command placeholder. */
async function reparseProgramFromActionCommand(program, actionCommand) {
  const rootProgram = findRootCommand(actionCommand);
  const normalizedArgv = hoistLazyParentOptions(
    buildParseArgv(rootProgram.rawArgs, rootProgram.name()),
    program,
    actionCommand.name(),
  );
  await rootProgram.parseAsync(normalizedArgv);
}
//#endregion
//#region src/cli/program/register-lazy-command.ts
/** Register a placeholder that loads the real command and reparses the original invocation. */
function registerLazyCommand({ program, name, description, options, removeNames, register }) {
  const placeholder = program.command(name).description(description);
  for (const option of options ?? []) placeholder.option(option.flags, option.description);
  placeholder.allowUnknownOption(true).allowExcessArguments(true);
  placeholder.action(async (...actionArgs) => {
    const actionCommand = actionArgs.at(-1);
    for (const commandName of new Set(removeNames ?? [name]))
      removeCommandByName(program, commandName);
    await register();
    await reparseProgramFromActionCommand(program, actionCommand);
  });
}
//#endregion
//#region src/cli/program/register-command-groups.ts
/** Return every command name owned by a lazy command group. */
function getCommandGroupNames(entry) {
  return entry.names ?? entry.placeholders.map((placeholder) => placeholder.name);
}
/** Find the group that owns a command name. */
function findCommandGroupEntry(entries, name) {
  return entries.find((entry) => getCommandGroupNames(entry).includes(name));
}
/** Remove all placeholder/loaded commands owned by a group before replacing it. */
function removeCommandGroupNames(program, entry) {
  for (const name of new Set(getCommandGroupNames(entry))) removeCommandByName(program, name);
}
/** Eagerly register one lazy command group by command name. */
async function registerCommandGroupByName(program, entries, name) {
  const entry = findCommandGroupEntry(entries, name);
  if (!entry) return false;
  removeCommandGroupNames(program, entry);
  await entry.register(program);
  return true;
}
/** Register one placeholder that loads and replaces its whole command group on demand. */
function registerLazyCommandGroup(program, entry, placeholder) {
  registerLazyCommand({
    program,
    name: placeholder.name,
    description: placeholder.description,
    options: placeholder.options,
    removeNames: getCommandGroupNames(entry),
    register: () => entry.register(program),
  });
}
/** Register command groups either eagerly or as lazy placeholders for startup speed. */
function registerCommandGroups(program, entries, params) {
  if (params.eager) {
    for (const entry of entries) entry.register(program);
    return;
  }
  if (params.primary && params.registerPrimaryOnly) {
    const entry = findCommandGroupEntry(entries, params.primary);
    if (entry) {
      const placeholder = entry.placeholders.find((candidate) => candidate.name === params.primary);
      if (placeholder) registerLazyCommandGroup(program, entry, placeholder);
      return;
    }
  }
  for (const entry of entries)
    for (const placeholder of entry.placeholders)
      registerLazyCommandGroup(program, entry, placeholder);
}
//#endregion
export {
  registerLazyCommandGroup as a,
  registerCommandGroups as i,
  getCommandGroupNames as n,
  removeCommandGroupNames as o,
  registerCommandGroupByName as r,
  findCommandGroupEntry as t,
};
