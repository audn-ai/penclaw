import { d as MigrationProviderContext, u as MigrationPlan } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/migrate-claude/plan.d.ts
declare function buildClaudePlan(ctx: MigrationProviderContext): Promise<MigrationPlan>;
//#endregion
export { buildClaudePlan };
