import {
  n as ChannelSetupWizard,
  t as ChannelSetupDmPolicy,
} from "./setup-wizard-types-BkGT_-Ru.js";
import { H as ChannelSetupAdapter } from "./types.adapters-BND_5Qr-.js";
//#region extensions/zalo/src/setup-core.d.ts
declare const zaloSetupAdapter: ChannelSetupAdapter;
declare const zaloDmPolicy: ChannelSetupDmPolicy;
declare function createZaloSetupWizardProxy(
  loadWizard: () => Promise<ChannelSetupWizard>,
): ChannelSetupWizard;
declare namespace setup_surface_d_exports {
  export { zaloSetupAdapter, zaloSetupWizard$1 as zaloSetupWizard };
}
declare const zaloSetupWizard$1: ChannelSetupWizard;
//#endregion
//#region extensions/zalo/setup-api.d.ts
type SetupSurfaceModule = typeof setup_surface_d_exports;
declare const zaloSetupWizard: SetupSurfaceModule["zaloSetupWizard"];
//#endregion
export {
  zaloSetupAdapter as i,
  createZaloSetupWizardProxy as n,
  zaloDmPolicy as r,
  zaloSetupWizard as t,
};
