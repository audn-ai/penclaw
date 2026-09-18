import { pt as ProviderAuthContext } from "./plugin-entry-DPCR66aO.js";
import { r as OAuthCredentials } from "./provider-oauth-runtime-rAAEMnI0.js";
//#region extensions/openai/openai-chatgpt-oauth.runtime.d.ts
type PreflightFailureKind = "tls-cert" | "network";
type OpenAIOAuthTlsPreflightResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      kind: PreflightFailureKind;
      code?: string;
      message: string;
    };
declare function runOpenAIOAuthTlsPreflight(options?: {
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}): Promise<OpenAIOAuthTlsPreflightResult>;
declare const testing: {
  runOpenAIOAuthTlsPreflight: typeof runOpenAIOAuthTlsPreflight;
};
declare function loginOpenAICodexOAuth(params: {
  prompter: ProviderAuthContext["prompter"];
  runtime: ProviderAuthContext["runtime"];
  oauth: ProviderAuthContext["oauth"];
  isRemote: boolean;
  openUrl: (url: string) => Promise<void>;
  signal?: AbortSignal;
  onManualCodeInput?: () => Promise<string>;
  localBrowserMessage?: string;
}): Promise<OAuthCredentials | null>;
//#endregion
export { testing as n, loginOpenAICodexOAuth as t };
