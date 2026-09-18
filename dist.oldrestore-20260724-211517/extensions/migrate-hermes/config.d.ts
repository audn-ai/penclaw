import { d as MigrationProviderContext, l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/migrate-hermes/config.d.ts
declare function buildConfigItems(params: {
  ctx: MigrationProviderContext;
  config: Record<string, unknown>;
  env?: Record<string, string>;
  runtimeEnv?: Record<string, string>;
  modelRef?: string;
  hasMemoryFiles?: boolean;
}): MigrationItem[];
declare function applyConfigItem(
  ctx: MigrationProviderContext,
  item: MigrationItem,
): Promise<MigrationItem>;
declare function applyManualItem(item: MigrationItem): MigrationItem;
//#endregion
export { applyConfigItem, applyManualItem, buildConfigItems };
