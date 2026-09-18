import { t as DiscordCredentialStatus } from "./token-jjArAZ6w.js";
import { ot as DiscordAccountConfig } from "./types.channels-CYB_Xphv.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region extensions/discord/src/account-inspect.d.ts
type InspectedDiscordAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "config" | "none";
  tokenStatus: DiscordCredentialStatus;
  configured: boolean;
  config: DiscordAccountConfig;
};
declare function inspectDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  envToken?: string | null;
}): InspectedDiscordAccount;
//#endregion
export { inspectDiscordAccount as n, InspectedDiscordAccount as t };
