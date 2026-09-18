import { n as HermesProviderConfig } from "../../config-provider-contract-yfmT5USa.js";
import { l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/migrate-hermes/config-providers.d.ts
type HermesProviderSecretBinding = {
  envVar: string;
  provider: string;
};
declare function collectHermesProviders(
  config: Record<string, unknown>,
  env?: Record<string, string>,
  includeSecrets?: boolean,
): HermesProviderConfig[];
declare function collectHermesProviderSecretBindings(
  config: Record<string, unknown>,
  env?: Record<string, string>,
): HermesProviderSecretBinding[];
declare function addSelectedModelToProvider(
  providers: HermesProviderConfig[],
  modelRef: string | undefined,
): void;
declare function providerManualItems(
  config: Record<string, unknown>,
  env: Record<string, string>,
  includeSecrets: boolean,
): MigrationItem[];
//#endregion
export {
  HermesProviderSecretBinding,
  addSelectedModelToProvider,
  collectHermesProviderSecretBindings,
  collectHermesProviders,
  providerManualItems,
};
