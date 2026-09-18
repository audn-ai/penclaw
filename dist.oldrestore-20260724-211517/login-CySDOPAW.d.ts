import { a as fetchWithSsrFGuard } from "./fetch-guard-BKvfwdRa.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/github-copilot/login.d.ts
declare function setGitHubCopilotDeviceFlowFetchGuardForTesting(
  impl: typeof fetchWithSsrFGuard | null,
): void;
type GitHubCopilotDeviceFlowResult =
  | {
      status: "authorized";
      accessToken: string;
    }
  | {
      status: "access_denied";
    }
  | {
      status: "expired";
    };
type GitHubCopilotDeviceFlowIO = {
  showCode(args: { verificationUrl: string; userCode: string; expiresInMs: number }): Promise<void>;
  openUrl?: (url: string) => Promise<void>;
  signal?: AbortSignal;
};
declare function runGitHubCopilotDeviceFlow(
  io: GitHubCopilotDeviceFlowIO,
  domain?: string,
): Promise<GitHubCopilotDeviceFlowResult>;
declare function withGithubCopilotDomainConfig(cfg: OpenClawConfig, domain: string): OpenClawConfig;
declare function githubCopilotLoginCommand(
  opts: {
    profileId?: string;
    yes?: boolean;
    agentDir?: string;
  },
  runtime: RuntimeEnv,
): Promise<void>;
//#endregion
export {
  withGithubCopilotDomainConfig as i,
  runGitHubCopilotDeviceFlow as n,
  setGitHubCopilotDeviceFlowFetchGuardForTesting as r,
  githubCopilotLoginCommand as t,
};
