import { n as readClaudeCliCredentialsForSetup } from "../../cli-auth-seam-DYo-xvbk.js";
import { Ot as ProviderAuthResult } from "../../types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/anthropic/cli-migration.d.ts
type ClaudeCliCredential = NonNullable<ReturnType<typeof readClaudeCliCredentialsForSetup>>;
/** Build the config migration result for adopting Claude CLI-backed Anthropic defaults. */
declare function buildAnthropicCliMigrationResult(
  config: OpenClawConfig,
  credential?: ClaudeCliCredential | null,
): ProviderAuthResult;
//#endregion
export { buildAnthropicCliMigrationResult };
