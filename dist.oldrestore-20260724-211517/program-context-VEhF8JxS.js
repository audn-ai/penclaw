//#region src/cli/program/program-context.ts
const PROGRAM_CONTEXT_SYMBOL = Symbol.for("openclaw.cli.programContext");
/** Attach the current root ProgramContext to a Commander program. */
function setProgramContext(program, ctx) {
  program[PROGRAM_CONTEXT_SYMBOL] = ctx;
}
/** Read ProgramContext metadata from a Commander program when available. */
function getProgramContext(program) {
  return program[PROGRAM_CONTEXT_SYMBOL];
}
//#endregion
export { setProgramContext as n, getProgramContext as t };
