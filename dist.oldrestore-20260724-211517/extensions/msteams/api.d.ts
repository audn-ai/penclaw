import { t as msteamsPlugin } from "../../channel-CL7ckBFD.js";
import { n as ChannelSetupWizard } from "../../setup-wizard-types-BkGT_-Ru.js";
import { H as ChannelSetupAdapter } from "../../types.adapters-BND_5Qr-.js";

//#region extensions/msteams/src/setup-core.d.ts
declare const msteamsSetupAdapter: ChannelSetupAdapter;
declare function createMSTeamsSetupWizardBase(): Pick<
  ChannelSetupWizard,
  | "channel"
  | "resolveAccountIdForConfigure"
  | "resolveShouldPromptAccountIds"
  | "status"
  | "credentials"
  | "finalize"
>;
//#endregion
//#region extensions/msteams/src/setup-surface.d.ts
declare function openDelegatedOAuthUrl(url: string): Promise<void>;
declare const msteamsSetupWizard: ChannelSetupWizard;
//#endregion
export {
  createMSTeamsSetupWizardBase,
  msteamsPlugin,
  msteamsSetupAdapter,
  msteamsSetupWizard,
  openDelegatedOAuthUrl,
};
