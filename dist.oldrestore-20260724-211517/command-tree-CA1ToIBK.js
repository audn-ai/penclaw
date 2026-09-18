//#region src/cli/program/command-tree.ts
/** Remove an exact Command instance from a parent program. */
function removeCommand(program, command) {
  const commands = program.commands;
  const index = commands.indexOf(command);
  if (index < 0) return false;
  commands.splice(index, 1);
  return true;
}
/** Remove a command by primary name or alias. */
function removeCommandByName(program, name) {
  const existing = program.commands.find(
    (command) => command.name() === name || command.aliases().includes(name),
  );
  if (!existing) return false;
  return removeCommand(program, existing);
}
//#endregion
export { removeCommandByName as t };
