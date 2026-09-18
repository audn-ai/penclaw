import { t as DEFAULT_ACCOUNT_ID } from "../account-id-C7N4Rwku.js";
import { t as formatDocsLink } from "../links-ClIwBcy4.js";
import {
  J as setSetupChannelEnabled,
  Q as splitSetupEntries,
  m as createTopLevelChannelDmPolicy,
} from "../setup-wizard-helpers-Kz9xlQ7e.js";
import "../setup-CM3hyaUe.js";
//#region src/plugin-sdk/optional-channel-setup.ts
function buildOptionalChannelSetupMessage(params) {
  const installTarget = params.npmSpec ?? `the ${params.label} plugin`;
  const message = [`${params.label} setup requires ${installTarget} to be installed.`];
  if (params.docsPath)
    message.push(`Docs: ${formatDocsLink(params.docsPath, params.docsPath.replace(/^\/+/u, ""))}`);
  return message.join(" ");
}
/**
 * Creates a setup adapter for optional channel plugins that are not installed.
 * Validation returns install guidance, while config mutation fails with the same
 * message so setup flows cannot silently create partial channel config.
 */
function createOptionalChannelSetupAdapter(params) {
  const message = buildOptionalChannelSetupMessage(params);
  return {
    resolveAccountId: ({ accountId }) => accountId ?? "default",
    applyAccountConfig: () => {
      throw new Error(message);
    },
    validateInput: () => message,
  };
}
/**
 * Creates a wizard surface for optional channel plugins that are not installed.
 * The wizard is always unconfigured and stops finalize with install guidance.
 */
function createOptionalChannelSetupWizard(params) {
  const message = buildOptionalChannelSetupMessage(params);
  return {
    channel: params.channel,
    status: {
      configuredLabel: `${params.label} plugin installed`,
      unconfiguredLabel: `install ${params.label} plugin`,
      configuredHint: message,
      unconfiguredHint: message,
      unconfiguredScore: 0,
      resolveConfigured: () => false,
      resolveStatusLines: () => [message],
      resolveSelectionHint: () => message,
    },
    credentials: [],
    finalize: async () => {
      throw new Error(message);
    },
  };
}
//#endregion
//#region src/plugin-sdk/channel-setup.ts
/** Build both optional setup surfaces from one metadata object. */
function createOptionalChannelSetupSurface(params) {
  return {
    setupAdapter: createOptionalChannelSetupAdapter(params),
    setupWizard: createOptionalChannelSetupWizard(params),
  };
}
//#endregion
export {
  DEFAULT_ACCOUNT_ID,
  createOptionalChannelSetupAdapter,
  createOptionalChannelSetupSurface,
  createOptionalChannelSetupWizard,
  createTopLevelChannelDmPolicy,
  formatDocsLink,
  setSetupChannelEnabled,
  splitSetupEntries,
};
