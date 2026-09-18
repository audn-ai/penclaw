import "./fs-safe-RNq3oO57.js";
import crypto from "node:crypto";
import { r as readRegularFile } from "./regular-file-CuvhUtZS.js";
//#region src/plugin-sdk/memory-migration-source.ts
const MAX_MEMORY_MIGRATION_FILE_BYTES = 64 * 1024 * 1024;
/** Bind copyable memory items to the exact source bytes reviewed by an embedded migration UI. */
async function bindMemoryMigrationPlanSources(plan, opts = {}) {
  const items = [];
  for (const item of plan.items) {
    if (
      item.kind !== "memory" ||
      item.action !== "copy" ||
      (item.status !== "planned" && !(opts.includeConflicts && item.status === "conflict")) ||
      !item.source
    ) {
      items.push(item);
      continue;
    }
    const { buffer } = await readRegularFile({
      filePath: item.source,
      maxBytes: MAX_MEMORY_MIGRATION_FILE_BYTES,
    });
    items.push({
      ...item,
      sourceRevision: {
        algorithm: "sha256",
        digest: crypto.createHash("sha256").update(buffer).digest("hex"),
      },
    });
  }
  return {
    ...plan,
    items,
  };
}
/** Reject source bytes that differ from an embedded migration's reviewed plan. */
function assertMemoryMigrationSourceRevision(item, sourceBuffer) {
  const expectedSourceSha256 = item.sourceRevision?.digest;
  if (
    item.sourceRevision?.algorithm === "sha256" &&
    typeof expectedSourceSha256 === "string" &&
    crypto.createHash("sha256").update(sourceBuffer).digest("hex") !== expectedSourceSha256
  )
    throw new Error("memory migration source changed; refresh the plan before importing");
}
//#endregion
export {
  assertMemoryMigrationSourceRevision as n,
  bindMemoryMigrationPlanSources as r,
  MAX_MEMORY_MIGRATION_FILE_BYTES as t,
};
