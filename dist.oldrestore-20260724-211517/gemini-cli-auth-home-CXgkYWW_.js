import crypto from "node:crypto";
import path from "node:path";
//#region extensions/google/gemini-cli-auth-home.ts
const GOOGLE_GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
function resolveGeminiCliProfileHome(agentDir, profileId) {
  const profileHash = crypto.createHash("sha256").update(profileId).digest("hex").slice(0, 24);
  return path.join(agentDir, `${GOOGLE_GEMINI_CLI_PROVIDER_ID}-home`, "profiles", profileHash);
}
//#endregion
export { resolveGeminiCliProfileHome as n, GOOGLE_GEMINI_CLI_PROVIDER_ID as t };
