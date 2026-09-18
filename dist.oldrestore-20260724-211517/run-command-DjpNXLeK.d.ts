//#region src/plugin-sdk/run-command.d.ts
/** Captured process result returned by plugin command execution helpers. */
type PluginCommandRunResult = {
  /** Process exit code, with `1` used when the command failed before spawning or did not report one. */ code: number /** Captured standard output as UTF-8 text. */;
  stdout: string /** Captured standard error, normalized to include timeout or thrown-error messages. */;
  stderr: string;
};
/** Options for commands that are launched on behalf of a plugin runtime. */
type PluginCommandRunOptions = {
  /** Executable and arguments, with the command name in the first slot. */ argv: string[] /** Hard execution limit in milliseconds before the command is terminated. */;
  timeoutMs: number /** Working directory for the child process. Defaults to the current process directory. */;
  cwd?: string /** Environment passed to the child process. Defaults to the current process environment. */;
  env?: NodeJS.ProcessEnv;
};
/** Run a plugin-managed command with timeout handling and normalized stdout/stderr results. */
declare function runPluginCommandWithTimeout(
  options: PluginCommandRunOptions,
): Promise<PluginCommandRunResult>;
//#endregion
export {
  PluginCommandRunResult as n,
  runPluginCommandWithTimeout as r,
  PluginCommandRunOptions as t,
};
