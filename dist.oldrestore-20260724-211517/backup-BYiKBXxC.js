import {
  n as formatBackupCreateSummary,
  t as createBackupArchive,
} from "./backup-create-T8osXtHl.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
//#region src/commands/backup.ts
const backupVerifyRuntimeLoader = createLazyImportLoader(
  () => import("./backup-verify-2sCiFusG.js"),
);
function loadBackupVerifyRuntime() {
  return backupVerifyRuntimeLoader.load();
}
/** Create a backup archive, optionally verify it, and emit text or JSON output. */
async function backupCreateCommand(runtime, opts = {}) {
  const result = await createBackupArchive({
    ...opts,
    log: opts.log ?? (opts.json ? void 0 : (message) => runtime.log(message)),
  });
  if (opts.verify && !opts.dryRun) {
    const { backupVerifyCommand } = await loadBackupVerifyRuntime();
    await backupVerifyCommand(
      {
        ...runtime,
        log: () => {},
      },
      {
        archive: result.archivePath,
        json: false,
      },
    );
    result.verified = true;
  }
  if (opts.json) writeRuntimeJson(runtime, result);
  else runtime.log(formatBackupCreateSummary(result).join("\n"));
  return result;
}
//#endregion
export { backupCreateCommand as t };
