import path from "node:path";
import { n as applyManualItem, t as applyConfigItem } from "./config-CmyRLnM-.js";
import { t as appendItem } from "./helpers-CWMv4L9s.js";
import { v as summarizeMigrationItems } from "./migration-nGWjmzKy.js";
import {
  a as withCachedMigrationConfigRuntime,
  i as resolvePlannedMigrationTargets,
  n as copyMemoryMigrationFileItem,
  o as writeMigrationReport,
  r as copyMigrationFileItem,
  t as archiveMigrationItem,
} from "./migration-runtime-BixoRS_B.js";
import "./targets-BqW-ncD_.js";
import { t as buildClaudePlan } from "./plan-DfFmqqLT.js";
import { t as applyGeneratedSkillItem } from "./skills-DHZzSZfi.js";
//#region extensions/migrate-claude/apply.ts
async function applyClaudePlan(params) {
  const plan = params.plan ?? (await buildClaudePlan(params.ctx));
  const reportDir = params.ctx.reportDir ?? path.join(params.ctx.stateDir, "migration", "claude");
  const runtime = withCachedMigrationConfigRuntime(
    params.ctx.runtime ?? params.runtime,
    params.ctx.config,
  );
  const targets = resolvePlannedMigrationTargets(params.ctx);
  const applyCtx = {
    ...params.ctx,
    runtime,
  };
  const items = [];
  for (const item of plan.items) {
    if (item.status !== "planned") {
      items.push(item);
      continue;
    }
    if (item.kind === "config") items.push(await applyConfigItem(applyCtx, item));
    else if (item.kind === "manual") items.push(applyManualItem(item));
    else if (item.action === "archive") items.push(await archiveMigrationItem(item, reportDir));
    else if (item.action === "append") items.push(await appendItem(item));
    else if (item.action === "create" && item.kind === "skill")
      items.push(await applyGeneratedSkillItem(item, { overwrite: params.ctx.overwrite }));
    else if (item.kind === "memory")
      items.push(
        await copyMemoryMigrationFileItem(item, reportDir, {
          workspaceDir: targets.workspaceDir,
          overwrite: params.ctx.overwrite,
        }),
      );
    else
      items.push(await copyMigrationFileItem(item, reportDir, { overwrite: params.ctx.overwrite }));
  }
  const result = {
    ...plan,
    items,
    summary: summarizeMigrationItems(items),
    backupPath: params.ctx.backupPath,
    reportDir,
  };
  await writeMigrationReport(result, { title: "Claude Migration Report" });
  return result;
}
//#endregion
export { applyClaudePlan as t };
