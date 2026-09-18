import { t as PlannedMigrationTargets } from "../../migration-runtime-C5uksO86.js";
import { l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";
import { i as ClaudeSource } from "../../source-qnAaBACK.js";
//#region extensions/migrate-claude/skills.d.ts
declare function buildSkillItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
declare function applyGeneratedSkillItem(
  item: MigrationItem,
  opts?: {
    overwrite?: boolean;
  },
): Promise<MigrationItem>;
//#endregion
export { applyGeneratedSkillItem, buildSkillItems };
