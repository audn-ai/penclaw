import { StringDecoder } from "node:string_decoder";
//#region src/process/exec-output.d.ts
type CommandOutputCaptureMode = "head" | "tail" | "discard";
type CommandOutputStream = "stdout" | "stderr";
type CommandOutputCaptureOption =
  | CommandOutputCaptureMode
  | {
      stdout?: CommandOutputCaptureMode;
      stderr?: CommandOutputCaptureMode;
    };
type CommandOutputLimitOption =
  | boolean
  | {
      stdout?: boolean;
      stderr?: boolean;
      combined?: boolean;
    };
type PreserveOutputLine = (line: string, stream: CommandOutputStream) => boolean;
//#endregion
//#region src/process/exec-result.d.ts
type SpawnResult = {
  pid?: number;
  stdout: string;
  stderr: string;
  stdoutTruncatedBytes?: number;
  stderrTruncatedBytes?: number;
  preservedStdoutLines?: string[];
  preservedStderrLines?: string[];
  code: number | null;
  signal: NodeJS.Signals | null;
  killed: boolean;
  termination: "exit" | "timeout" | "no-output-timeout" | "signal";
  noOutputTimedOut?: boolean;
  outputLimitExceeded?: boolean;
  outputErrorStream?: "stdout" | "stderr";
};
declare function resolveProcessExitCode(params: {
  explicitCode: number | null | undefined;
  childExitCode: number | null | undefined;
  resolvedSignal: NodeJS.Signals | null;
  usesWindowsExitCodeShim: boolean;
  timedOut: boolean;
  noOutputTimedOut: boolean;
  killIssuedByTimeout: boolean;
  killIssuedByAbort?: boolean;
}): number | null;
//#endregion
//#region src/process/exec-runner.d.ts
type CommandOptions = {
  timeoutMs?: number;
  cwd?: string;
  input?: string | Uint8Array;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  windowsVerbatimArguments?: boolean;
  noOutputTimeoutMs?: number;
  signal?: AbortSignal;
  maxOutputBytes?:
    | number
    | {
        stdout?: number;
        stderr?: number;
      };
  maxCombinedOutputBytes?: number;
  outputCapture?: CommandOutputCaptureOption /** Observe raw output without owning child lifecycle. Return false to stop the command. */;
  onOutputChunk?: (
    chunk: Buffer,
    stream: CommandOutputStream,
  ) =>
    | boolean
    | void /** Accept a successful exit when only the selected diagnostic output stream failed. */;
  tolerateOutputError?: {
    stdout?: boolean;
    stderr?: boolean;
  };
  terminateOnOutputLimit?: CommandOutputLimitOption;
  maxPreservedOutputLines?: number;
  preserveOutputLine?: PreserveOutputLine;
  killProcessTree?: boolean /** Signal used when terminating the direct child; tree termination owns its own grace policy. */;
  killSignal?: NodeJS.Signals | number;
};
declare function runCommandWithTimeout(
  argv: string[],
  optionsOrTimeout: number | CommandOptions,
): Promise<SpawnResult>;
//#endregion
//#region src/process/exec-spawn.d.ts
declare function shouldSpawnWithShell(params: {
  resolvedCommand: string;
  platform: NodeJS.Platform;
}): boolean;
declare function resolveCommandEnv(params: {
  argv: string[];
  env?: NodeJS.ProcessEnv;
  baseEnv?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
}): NodeJS.ProcessEnv;
//#endregion
//#region src/process/exec.d.ts
type RunExecOptions = {
  timeoutMs?: number;
  maxBuffer?: number;
  logOutput?: boolean;
  cwd?: string;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  input?: string | Uint8Array;
  signal?: AbortSignal;
};
declare function runExec(
  command: string,
  args: string[],
  opts?: number | RunExecOptions,
): Promise<{
  stdout: string;
  stderr: string;
}>;
type BufferedCommandOptions = {
  timeoutMs?: number;
  cwd?: string;
  input?: string | Uint8Array;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  signal?: AbortSignal;
  maxOutputBytes?:
    | number
    | {
        stdout?: number;
        stderr?: number;
      };
  discardOutput?: {
    stdout?: boolean;
    stderr?: boolean;
  };
  tolerateOutputError?: {
    stdout?: boolean;
    stderr?: boolean;
  };
};
type BufferedCommandResult = {
  stdout: Buffer;
  stderr: Buffer;
  code: number | null;
  signal: NodeJS.Signals | null;
  killed: boolean;
  termination: "exit" | "timeout" | "signal" | "output-limit" | "error";
  outputLimitStream?: CommandOutputStream;
  errorStream?: CommandOutputStream;
  error?: Error;
};
/** Run a one-shot command with raw, independently capped stdout and stderr buffers. */
declare function runCommandBuffered(
  argv: string[],
  options?: BufferedCommandOptions,
): Promise<BufferedCommandResult>;
//#endregion
export {
  CommandOptions as a,
  resolveProcessExitCode as c,
  shouldSpawnWithShell as i,
  runExec as n,
  runCommandWithTimeout as o,
  resolveCommandEnv as r,
  SpawnResult as s,
  runCommandBuffered as t,
};
