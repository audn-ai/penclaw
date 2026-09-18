//#region src/infra/home-dir.d.ts
/** Resolves OpenClaw's effective home, honoring OPENCLAW_HOME before OS homes. */
declare function resolveEffectiveHomeDir(
  env?: NodeJS.ProcessEnv,
  homedir?: () => string,
): string | undefined;
/** Resolves the underlying OS user home, ignoring OPENCLAW_HOME overrides. */
declare function resolveOsHomeDir(
  env?: NodeJS.ProcessEnv,
  homedir?: () => string,
): string | undefined;
/** Resolves the effective home or falls back to cwd when no home source exists. */
declare function resolveRequiredHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the OS home or falls back to cwd when no OS home source exists. */
declare function resolveRequiredOsHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
declare function expandHomePrefix(
  input: string,
  opts?: {
    home?: string;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
  },
): string;
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
declare function resolveHomeRelativePath(
  input: string,
  opts?: {
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
  },
): string;
/** Resolves a user path against the effective home, preserving an empty input. */
declare function resolveUserPath(
  input: string,
  env?: NodeJS.ProcessEnv,
  homedir?: () => string,
): string;
/** Resolves a user-supplied path against the OS home, ignoring OPENCLAW_HOME. */
declare function resolveOsHomeRelativePath(
  input: string,
  opts?: {
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
  },
): string;
//#endregion
export {
  resolveOsHomeRelativePath as a,
  resolveUserPath as c,
  resolveOsHomeDir as i,
  resolveEffectiveHomeDir as n,
  resolveRequiredHomeDir as o,
  resolveHomeRelativePath as r,
  resolveRequiredOsHomeDir as s,
  expandHomePrefix as t,
};
