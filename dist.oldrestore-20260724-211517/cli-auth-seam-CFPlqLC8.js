import { o as readClaudeCliCredentialsCached } from "./external-auth-aN0UYCd0.js";
import "./provider-auth-mypr64nh.js";
//#region extensions/anthropic/cli-auth-seam.ts
/**
 * Claude CLI auth seam. Setup may prompt for keychain-backed credentials while
 * runtime paths stay non-interactive.
 */
/** Read Claude CLI credentials for interactive setup paths. */
function readClaudeCliCredentialsForSetup() {
  return readClaudeCliCredentialsCached();
}
/** Read Claude CLI credentials for setup checks that must not prompt. */
function readClaudeCliCredentialsForSetupNonInteractive() {
  return readClaudeCliCredentialsCached({ allowKeychainPrompt: false });
}
/** Read Claude CLI credentials for runtime without keychain prompts. */
function readClaudeCliCredentialsForRuntime() {
  return readClaudeCliCredentialsCached({ allowKeychainPrompt: false });
}
//#endregion
export {
  readClaudeCliCredentialsForSetup as n,
  readClaudeCliCredentialsForSetupNonInteractive as r,
  readClaudeCliCredentialsForRuntime as t,
};
