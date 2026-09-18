import { t as ClaudeCliCredential } from "./cli-credentials-ktnN0wd_.js";

//#region extensions/anthropic/cli-auth-seam.d.ts
/** Read Claude CLI credentials for interactive setup paths. */
declare function readClaudeCliCredentialsForSetup(): ClaudeCliCredential | null;
/** Read Claude CLI credentials for setup checks that must not prompt. */
declare function readClaudeCliCredentialsForSetupNonInteractive(): ClaudeCliCredential | null;
/** Read Claude CLI credentials for runtime without keychain prompts. */
declare function readClaudeCliCredentialsForRuntime(): ClaudeCliCredential | null;
//#endregion
export {
  readClaudeCliCredentialsForSetup as n,
  readClaudeCliCredentialsForSetupNonInteractive as r,
  readClaudeCliCredentialsForRuntime as t,
};
