import { i as WizardPrompter } from "../prompts-CWXx5gsI.js";
import { r as OAuthCredentials } from "../provider-oauth-runtime-rAAEMnI0.js";
import { n as RuntimeEnv } from "../runtime-Bxifh4bY.js";
//#region src/agents/chutes-oauth.d.ts
type ChutesPkce = {
  verifier: string;
  challenge: string;
};
/** OAuth client settings for the Chutes authorization-code flow. */
type ChutesOAuthAppConfig = {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes: string[];
};
/** Generates a PKCE verifier/challenge pair for Chutes login. */
declare function generateChutesPkce(): ChutesPkce;
//#endregion
//#region src/commands/chutes-oauth.d.ts
type OAuthPrompt = {
  message: string;
  placeholder?: string;
};
/** Run a PKCE OAuth login for Chutes and exchange the resulting code for credentials. */
declare function loginChutes$1(params: {
  app: ChutesOAuthAppConfig;
  manual?: boolean;
  timeoutMs?: number;
  createPkce?: typeof generateChutesPkce;
  createState?: () => string;
  onAuth: (event: { url: string }) => Promise<void>;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
  onProgress?: (message: string) => void;
  fetchFn?: typeof fetch;
}): Promise<OAuthCredentials>;
//#endregion
//#region src/plugins/provider-openai-chatgpt-oauth.d.ts
type OpenAICodexOAuthLoginParams = {
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  isRemote: boolean;
  openUrl: (url: string) => Promise<void>;
  signal?: AbortSignal;
  onManualCodeInput?: () => Promise<string>;
  localBrowserMessage?: string;
};
/** @deprecated OpenAI Codex OAuth is owned by the OpenAI plugin auth hook. */
declare function loginOpenAICodexOAuth$1(
  params: OpenAICodexOAuthLoginParams,
): Promise<OAuthCredentials | null>;
//#endregion
//#region src/plugin-sdk/github-copilot-login.d.ts
type FacadeModule = {
  githubCopilotLoginCommand: (
    opts: {
      profileId?: string;
      yes?: boolean;
      agentDir?: string;
    },
    runtime: RuntimeEnv,
  ) => Promise<void>;
};
/** @deprecated GitHub Copilot provider-owned login helper; use provider auth hooks instead. */
declare const githubCopilotLoginCommand$1: FacadeModule["githubCopilotLoginCommand"];
declare namespace provider_auth_login_runtime_d_exports {
  export {
    githubCopilotLoginCommand$1 as githubCopilotLoginCommand,
    loginChutes$1 as loginChutes,
    loginOpenAICodexOAuth$1 as loginOpenAICodexOAuth,
  };
}
//#endregion
//#region src/plugin-sdk/provider-auth-login.d.ts
/**
 * @deprecated Compatibility subpath for provider-owned login helpers.
 * Use provider auth hooks instead of importing bundled provider login commands.
 */
type ProviderAuthLoginRuntime = typeof provider_auth_login_runtime_d_exports;
/** @deprecated GitHub Copilot provider-owned login helper; use provider auth hooks instead. */
declare const githubCopilotLoginCommand: ProviderAuthLoginRuntime["githubCopilotLoginCommand"];
/** @deprecated Chutes provider-owned login helper; use provider auth hooks instead. */
declare const loginChutes: ProviderAuthLoginRuntime["loginChutes"];
/** @deprecated OpenAI Codex provider-owned login helper; use provider auth hooks instead. */
declare const loginOpenAICodexOAuth: ProviderAuthLoginRuntime["loginOpenAICodexOAuth"];
//#endregion
export { githubCopilotLoginCommand, loginChutes, loginOpenAICodexOAuth };
