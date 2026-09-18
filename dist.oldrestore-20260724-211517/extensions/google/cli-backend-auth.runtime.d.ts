import { ta as CliBackendPreparedExecution } from "../../types-Ga3mNO_F.js";
//#region extensions/google/cli-backend-auth.runtime.d.ts
type GeminiCliAuthHomeContext = {
  agentDir?: string;
  authProfileId?: string;
  systemSettingsPath?: string;
};
declare function prepareGeminiCliAuthHome(
  ctx: GeminiCliAuthHomeContext,
  credential: unknown,
): Promise<CliBackendPreparedExecution | null>;
//#endregion
export { prepareGeminiCliAuthHome };
