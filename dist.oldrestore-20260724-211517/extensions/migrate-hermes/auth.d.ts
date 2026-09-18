import { t as PlannedMigrationTargets } from "../../migration-runtime-C5uksO86.js";
import { d as MigrationProviderContext, l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";
import { t as HermesSource } from "../../source-CnuRfNXX.js";
//#region extensions/migrate-hermes/auth.d.ts
declare function buildAuthItems(params: {
  ctx: MigrationProviderContext;
  source: HermesSource;
  targets: PlannedMigrationTargets;
}): Promise<MigrationItem[]>;
declare function applyAuthItem(
  ctx: MigrationProviderContext,
  item: MigrationItem,
  targets: PlannedMigrationTargets,
): Promise<MigrationItem>;
//#endregion
export { applyAuthItem, buildAuthItems };
