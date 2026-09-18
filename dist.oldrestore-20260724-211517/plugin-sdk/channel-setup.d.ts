import { t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { t as formatDocsLink } from "../links-DFOTZJs1.js";
import {
  C as createTopLevelChannelDmPolicy,
  nt as setSetupChannelEnabled,
  ot as splitSetupEntries,
} from "../setup-wizard-binary-CUAlIYEv.js";
import {
  n as ChannelSetupWizard,
  t as ChannelSetupDmPolicy,
} from "../setup-wizard-types-BkGT_-Ru.js";
import { H as ChannelSetupAdapter } from "../types.adapters-BND_5Qr-.js";
import { N as ChannelSetupInput } from "../types.core-CcwzPNhX.js";
//#region src/plugin-sdk/optional-channel-setup.d.ts
type OptionalChannelSetupParams$1 = {
  /** Channel id used by setup wizard status and routing. */ channel: string /** Human-readable plugin label shown in operator-facing install guidance. */;
  label: string /** Package spec operators should install before running real channel setup. */;
  npmSpec?: string /** Docs path linked from validation and wizard status messages. */;
  docsPath?: string;
};
/**
 * Creates a setup adapter for optional channel plugins that are not installed.
 * Validation returns install guidance, while config mutation fails with the same
 * message so setup flows cannot silently create partial channel config.
 */
declare function createOptionalChannelSetupAdapter(
  /** Optional plugin metadata used to build setup validation guidance. */

  params: OptionalChannelSetupParams$1,
): ChannelSetupAdapter;
/**
 * Creates a wizard surface for optional channel plugins that are not installed.
 * The wizard is always unconfigured and stops finalize with install guidance.
 */
declare function createOptionalChannelSetupWizard(
  /** Optional plugin metadata used to build setup wizard status guidance. */

  params: OptionalChannelSetupParams$1,
): ChannelSetupWizard;
//#endregion
//#region src/plugin-sdk/channel-setup.d.ts
/** Metadata used to advertise an optional channel plugin during setup flows. */
type OptionalChannelSetupParams = {
  /** Channel id shown in setup status and wizard routing. */ channel: string /** Human-readable plugin name used in install guidance. */;
  label: string /** Package spec operators should install to enable the optional channel. */;
  npmSpec?: string /** Docs path linked from setup validation and wizard hints. */;
  docsPath?: string;
};
/** Paired setup adapter + setup wizard for channels that may not be installed yet. */
type OptionalChannelSetupSurface = {
  /** Adapter that fails validation with install guidance until the plugin is installed. */ setupAdapter: ChannelSetupAdapter /** Wizard status/finalize surface that points operators to the missing plugin. */;
  setupWizard: ChannelSetupWizard;
};
/** Build both optional setup surfaces from one metadata object. */
declare function createOptionalChannelSetupSurface(
  /** Optional plugin metadata shared by the adapter and wizard. */

  params: OptionalChannelSetupParams,
): OptionalChannelSetupSurface;
//#endregion
export {
  type ChannelSetupAdapter,
  type ChannelSetupDmPolicy,
  type ChannelSetupInput,
  type ChannelSetupWizard,
  DEFAULT_ACCOUNT_ID,
  OptionalChannelSetupSurface,
  createOptionalChannelSetupAdapter,
  createOptionalChannelSetupSurface,
  createOptionalChannelSetupWizard,
  createTopLevelChannelDmPolicy,
  formatDocsLink,
  setSetupChannelEnabled,
  splitSetupEntries,
};
