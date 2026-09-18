//#region src/auto-reply/commands-args.types.d.ts
/** Primitive values accepted by parsed auto-reply command args. */
type CommandArgValue = string | number | boolean | bigint;
/** Named parsed auto-reply command values. */
type CommandArgValues = Record<string, CommandArgValue>;
/** Parsed command argument bundle with raw source and structured values. */
type CommandArgs = {
  raw?: string;
  values?: CommandArgValues;
};
//#endregion
export { CommandArgs as n, CommandArgValues as t };
