//#region extensions/google/gemini-cli-auth-home.d.ts
declare const GOOGLE_GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
declare function resolveGeminiCliProfileHome(agentDir: string, profileId: string): string;
//#endregion
export { GOOGLE_GEMINI_CLI_PROVIDER_ID, resolveGeminiCliProfileHome };
