import { It as ProviderPrepareDynamicModelContext } from "../../plugin-entry-DPCR66aO.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/github-copilot/auth.d.ts
declare function resolveFirstGithubToken(params: {
  agentDir?: string;
  config?: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  profileId?: string;
  authProfileMode?: ProviderPrepareDynamicModelContext["authProfileMode"];
}): Promise<{
  githubToken: string;
  hasProfile: boolean;
}>;
//#endregion
export { resolveFirstGithubToken };
