import { t as PlannedMigrationTargets } from "../../migration-runtime-C5uksO86.js";
import { l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";
import { i as ClaudeSource } from "../../source-qnAaBACK.js";
//#region extensions/migrate-claude/memory.d.ts
declare function buildMemoryItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
  includeInstructions?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildMemoryItems };
