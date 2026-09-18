import fs from "node:fs/promises";
import "./fs-safe-RNq3oO57.js";
import path from "node:path";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { t as appendRegularFile } from "./regular-file-CuvhUtZS.js";
//#region src/crestodian/audit.ts
/** Resolve the JSONL audit path for Crestodian persistent operations. */
function resolveCrestodianAuditPath(env = process.env, stateDir = resolveStateDir(env)) {
  return path.join(stateDir, "audit", "crestodian.jsonl");
}
/** Append one Crestodian audit entry and return the file path written. */
async function appendCrestodianAuditEntry(entry, opts = {}) {
  const auditPath = opts.auditPath ?? resolveCrestodianAuditPath(opts.env);
  await fs.mkdir(path.dirname(auditPath), { recursive: true });
  await appendRegularFile({
    filePath: auditPath,
    content: `${JSON.stringify({
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      ...entry,
    })}\n`,
    rejectSymlinkParents: true,
  });
  return auditPath;
}
//#endregion
export { resolveCrestodianAuditPath as n, appendCrestodianAuditEntry as t };
