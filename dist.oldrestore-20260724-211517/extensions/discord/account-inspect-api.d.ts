import { t as InspectedDiscordAccount } from "../../account-inspect-BHDKo_bp.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";

//#region extensions/discord/account-inspect-api.d.ts
declare function inspectDiscordReadOnlyAccount(
  cfg: OpenClawConfig,
  accountId?: string | null,
): InspectedDiscordAccount;
//#endregion
export { inspectDiscordReadOnlyAccount };
