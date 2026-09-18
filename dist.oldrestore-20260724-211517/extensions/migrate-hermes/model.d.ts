import { d as MigrationProviderContext, l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/migrate-hermes/model.d.ts
declare function normalizeHermesProviderId(provider: string): string;
declare function normalizeHermesCustomProviderId(provider: string): string;
declare function resolveHermesConfiguredProviderId(
  config: Record<string, unknown>,
  provider: string,
  env?: Record<string, string>,
): string;
declare function resolveHermesModelRef(
  config: Record<string, unknown>,
  env?: Record<string, string>,
): string | undefined;
declare function resolveCurrentModelRef(ctx: MigrationProviderContext): string | undefined;
declare function applyModelItem(
  ctx: MigrationProviderContext,
  item: MigrationItem,
): Promise<MigrationItem>;
//#endregion
export {
  applyModelItem,
  normalizeHermesCustomProviderId,
  normalizeHermesProviderId,
  resolveCurrentModelRef,
  resolveHermesConfiguredProviderId,
  resolveHermesModelRef,
};
