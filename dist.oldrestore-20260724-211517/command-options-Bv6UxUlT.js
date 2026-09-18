//#region src/cli/command-options.ts
function hasExplicitOptions(command, names) {
  return names.some((name) => command.getOptionValueSource(name) === "cli");
}
const MAX_INHERIT_DEPTH = 2;
function inheritOptionFromParent(command, name) {
  if (!command) return;
  const childSource = command.getOptionValueSource(name);
  if (childSource && childSource !== "default") return;
  let depth = 0;
  let ancestor = command.parent;
  while (ancestor && depth < MAX_INHERIT_DEPTH) {
    const source = ancestor.getOptionValueSource(name);
    if (source && source !== "default") return ancestor.getOptionValue(name);
    depth += 1;
    ancestor = ancestor.parent;
  }
}
//#endregion
export { inheritOptionFromParent as n, hasExplicitOptions as t };
