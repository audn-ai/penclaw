import { U as ChannelLegacyStateMigrationPlan } from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/telegram/src/state-migrations.d.ts
declare function detectTelegramLegacyStateMigrations(params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir?: string;
}): Promise<ChannelLegacyStateMigrationPlan[]>;
//#endregion
export { detectTelegramLegacyStateMigrations };
