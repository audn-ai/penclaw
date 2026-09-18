//#region src/cli/command-format.d.ts
/** Add active root options to a displayed command without duplicating explicit flags. */
declare function formatCliCommand(
  command: string,
  env?: Record<string, string | undefined>,
): string;
//#endregion
export { formatCliCommand as t };
