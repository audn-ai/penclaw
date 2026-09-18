import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/infra/diagnostic-flags.d.ts
/** Resolves enabled diagnostic flags from config plus `OPENCLAW_DIAGNOSTICS` overrides. */
declare function resolveDiagnosticFlags(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): string[];
/** Matches one diagnostic flag against exact, wildcard, and namespace-enabled flags. */
declare function matchesDiagnosticFlag(flag: string, enabledFlags: string[]): boolean;
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
declare function isDiagnosticFlagEnabled(
  flag: string,
  cfg?: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
): boolean;
//#endregion
export { matchesDiagnosticFlag as n, resolveDiagnosticFlags as r, isDiagnosticFlagEnabled as t };
