import { n as PluginManifestCommandAliasRegistry } from "../manifest-command-aliases-DOsqsy-q.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/cli/run-main-policy.d.ts
declare function rewriteUpdateFlagArgv(argv: string[]): string[];
declare function shouldEnsureCliPath(argv: string[]): boolean;
declare function shouldUseRootHelpFastPath(argv: string[], env?: NodeJS.ProcessEnv): boolean;
declare function shouldUseSetupOnboardConfigureHelpFastPath(
  argv: string[],
  env?: NodeJS.ProcessEnv,
): boolean;
declare function shouldHandleBareRoot(argv: string[]): boolean;
declare function shouldStartProxyForCli(argv: string[]): boolean;
//#endregion
//#region src/cli/run-main.d.ts
declare function isGatewayRunFastPathArgv(argv: string[]): boolean;
declare function shouldStartOnboardingForFreshInstall(argv: string[]): Promise<boolean>;
declare function resolveMissingPluginCommandMessage(
  pluginId: string,
  config?: OpenClawConfig,
  options?: {
    registry?: PluginManifestCommandAliasRegistry;
  },
): string | null;
declare function runCli(argv?: string[]): Promise<void>;
//#endregion
export {
  isGatewayRunFastPathArgv,
  resolveMissingPluginCommandMessage,
  rewriteUpdateFlagArgv,
  runCli,
  shouldEnsureCliPath,
  shouldHandleBareRoot,
  shouldStartOnboardingForFreshInstall,
  shouldStartProxyForCli,
  shouldUseRootHelpFastPath,
  shouldUseSetupOnboardConfigureHelpFastPath,
};
