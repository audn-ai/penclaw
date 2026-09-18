import { Command } from "commander";

//#region src/cli/command-options.d.ts
declare function inheritOptionFromParent<T = unknown>(
  command: Command | undefined,
  name: string,
): T | undefined;
//#endregion
//#region src/cli/program/register-command-groups.d.ts
/** Placeholder command shown before its lazy group is loaded. */
type CommandGroupPlaceholder = {
  name: string;
  description: string;
  options?: readonly CommandGroupPlaceholderOption[];
};
/** Commander option metadata attached to a lazy placeholder. */
type CommandGroupPlaceholderOption = {
  flags: string;
  description: string;
};
/** A lazily registered command group and the names it owns. */
type CommandGroupEntry = {
  placeholders: readonly CommandGroupPlaceholder[];
  names?: readonly string[];
  register: (program: Command) => Promise<void> | void;
};
/** Register command groups either eagerly or as lazy placeholders for startup speed. */
declare function registerCommandGroups(
  program: Command,
  entries: readonly CommandGroupEntry[],
  params: {
    eager: boolean;
    primary: string | null;
    registerPrimaryOnly: boolean;
  },
): void;
//#endregion
//#region src/cli/argv-invocation.d.ts
type CliArgvInvocation = {
  argv: string[];
  commandPath: string[];
  primary: string | null;
  hasHelpOrVersion: boolean;
  isRootHelpInvocation: boolean;
};
/** Resolves command path and help/version mode from a raw process argv array. */
declare function resolveCliArgvInvocation(argv: string[]): CliArgvInvocation;
//#endregion
//#region src/cli/command-registration-policy.d.ts
declare function shouldEagerRegisterSubcommands(env?: NodeJS.ProcessEnv): boolean;
//#endregion
export {
  CommandGroupPlaceholder as a,
  CommandGroupEntry as i,
  CliArgvInvocation as n,
  registerCommandGroups as o,
  resolveCliArgvInvocation as r,
  inheritOptionFromParent as s,
  shouldEagerRegisterSubcommands as t,
};
