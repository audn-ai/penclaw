import { n as configureFsSafePython } from "./fs-safe-defaults-B7hUN42l.js";
import "./openclaw-runtime-CVmkSH_l.js";
//#region packages/memory-host-sdk/src/host/fs-utils.ts
if (!(process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null))
  configureFsSafePython({ mode: "off" });
/** True for missing-file errors emitted by Node or fs-safe. */
function isFileMissingError(err) {
  return Boolean(
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err.code === "ENOENT" || err.code === "ENOTDIR" || err.code === "not-found"),
  );
}
//#endregion
export { isFileMissingError as t };
