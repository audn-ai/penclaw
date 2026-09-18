import { Command } from "commander";

//#region src/cli/cli-utils.d.ts
type ManagerLookupResult<T> = {
  manager: T | null;
  error?: string;
};
declare function withManager<T>(params: {
  getManager: () => Promise<ManagerLookupResult<T>>;
  onMissing: (error?: string) => void;
  run: (manager: T) => Promise<void>;
  close: (manager: T) => Promise<void>;
  onCloseError?: (err: unknown) => void;
}): Promise<void>;
declare function runCommandWithRuntime(
  runtime: {
    error: (message: string) => void;
    exit: (code: number) => void;
  },
  action: () => Promise<void>,
  onError?: (error: unknown) => void,
): Promise<void>;
//#endregion
//#region src/cli/help-format.d.ts
/** Command plus short description tuple used in help epilogues. */
type HelpExample = readonly [command: string, description: string];
/** Render help examples in stacked or inline comment style. */
declare function formatHelpExamples(examples: ReadonlyArray<HelpExample>, inline?: boolean): string;
//#endregion
//#region src/cli/parse-duration.d.ts
/** Options for choosing the unit used by bare numeric duration values. */
type DurationMsParseOptions = {
  defaultUnit?: "ms" | "s" | "m" | "h" | "d";
};
/** Parse a non-negative duration into milliseconds, supporting single and composite units. */
declare function parseDurationMs(raw: string, opts?: DurationMsParseOptions): number;
//#endregion
export {
  withManager as a,
  runCommandWithRuntime as i,
  parseDurationMs as n,
  formatHelpExamples as r,
  DurationMsParseOptions as t,
};
