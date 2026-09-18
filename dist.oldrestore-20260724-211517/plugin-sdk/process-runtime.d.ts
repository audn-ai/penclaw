import {
  a as CommandOptions,
  c as resolveProcessExitCode,
  i as shouldSpawnWithShell,
  n as runExec,
  o as runCommandWithTimeout,
  r as resolveCommandEnv,
  s as SpawnResult,
  t as runCommandBuffered,
} from "../exec-D8nvu0GV.js";

//#region src/process/linux-oom-score.d.ts
type OomWrapOptions = {
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  shellAvailable?: () => boolean;
};
type OomScoreAdjustedSpawn = {
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv | undefined;
  wrapped: boolean;
};
declare function prepareOomScoreAdjustedSpawn(
  command: string,
  args?: readonly string[],
  options?: OomWrapOptions,
): OomScoreAdjustedSpawn;
//#endregion
export {
  type CommandOptions,
  type OomScoreAdjustedSpawn,
  type OomWrapOptions,
  type SpawnResult,
  prepareOomScoreAdjustedSpawn,
  resolveCommandEnv,
  resolveProcessExitCode,
  runCommandBuffered,
  runCommandWithTimeout,
  runExec,
  shouldSpawnWithShell,
};
