import { n as zalouserSetupAdapter } from "./setup-core-CsmOh80f.js";
import { t as zalouserSetupWizard } from "./setup-surface-GCkvm-l3.js";
import { t as createZalouserPluginBase } from "./shared-Dwnf2z5e.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = {
  ...createZalouserPluginBase({
    setupWizard: zalouserSetupWizard,
    setup: zalouserSetupAdapter,
  }),
};
//#endregion
export { zalouserSetupPlugin as t };
