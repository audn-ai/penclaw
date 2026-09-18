import { d as MigrationProviderContext, l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";
import { i as ClaudeSource } from "../../source-qnAaBACK.js";

//#region extensions/migrate-claude/config.d.ts
declare function buildConfigItems(params: {
  ctx: MigrationProviderContext;
  source: ClaudeSource;
}): Promise<MigrationItem[]>;
declare function applyConfigItem(
  ctx: MigrationProviderContext,
  item: MigrationItem,
): Promise<MigrationItem>;
declare function applyManualItem(item: MigrationItem): MigrationItem;
//#endregion
export { applyConfigItem, applyManualItem, buildConfigItems };
