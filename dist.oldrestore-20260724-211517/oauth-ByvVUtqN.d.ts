import {
  o as GeminiCliOAuthContext,
  s as GeminiCliOAuthCredentials,
} from "./oauth.shared-CrO4eTSb.js";
import { c as OAuthCredential } from "./types-Dzb4Vh4b.js";

//#region extensions/google/oauth.d.ts
declare function loginGeminiCliOAuth(
  ctx: GeminiCliOAuthContext,
): Promise<GeminiCliOAuthCredentials>;
declare function refreshGeminiCliOAuthToken(
  credentials: Pick<GeminiCliOAuthCredentials, "refresh" | "email" | "projectId">,
): Promise<OAuthCredential>;
//#endregion
export { refreshGeminiCliOAuthToken as n, loginGeminiCliOAuth as t };
