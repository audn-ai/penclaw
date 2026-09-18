import { t as PlannedMigrationTargets } from "../../migration-runtime-C5uksO86.js";
import { l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";
import { t as HermesSource } from "../../source-CnuRfNXX.js";
//#region extensions/migrate-hermes/skills.d.ts
declare function buildSkillItems(params: {
  source: HermesSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildSkillItems };
