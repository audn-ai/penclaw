import { s as GeminiCliOAuthCredentials } from "../../oauth.shared-CrO4eTSb.js";

//#region extensions/google/oauth.token.d.ts
declare function exchangeCodeForTokens(
  code: string,
  verifier: string,
  signal?: AbortSignal,
): Promise<GeminiCliOAuthCredentials>;
declare function refreshTokensForGeminiCli(credentials: {
  refresh: string;
  email?: string;
  projectId?: string;
}): Promise<GeminiCliOAuthCredentials>;
//#endregion
export { exchangeCodeForTokens, refreshTokensForGeminiCli };
