import { t as CreateWebSearchProviderContractFieldsOptions } from "./provider-web-search-contract-fields-C-gZpUBW.js";
import { pu as WebSearchProviderPlugin } from "./types-Ga3mNO_F.js";

//#region src/plugin-sdk/provider-web-search-contract.d.ts
type CreateWebSearchProviderSelectionOptions = CreateWebSearchProviderContractFieldsOptions & {
  /** Plugin id to enable when this provider is selected through setup/configuration flows. */ selectionPluginId?: string;
};
/** Build the public web-search provider hooks, including optional selection-time plugin enabling. */
declare function createWebSearchProviderContractFields(
  options: CreateWebSearchProviderSelectionOptions,
): Pick<
  WebSearchProviderPlugin,
  "inactiveSecretPaths" | "getCredentialValue" | "setCredentialValue"
> &
  Partial<
    Pick<
      WebSearchProviderPlugin,
      "applySelectionConfig" | "getConfiguredCredentialValue" | "setConfiguredCredentialValue"
    >
  >;
//#endregion
export { createWebSearchProviderContractFields as t };
