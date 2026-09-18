import {
  i as readSecretFileSync,
  t as DEFAULT_SECRET_FILE_MAX_BYTES,
} from "./secret-file-C3z_7aGt.js";
import "./secret-file-BMs7qbMt.js";
//#region src/acp/secret-file.ts
/** Secret-file reader for ACP command-line credentials. */
const MAX_SECRET_FILE_BYTES = DEFAULT_SECRET_FILE_MAX_BYTES;
/** Reads an ACP secret file with the shared secret-file size and symlink policy. */
function readSecretFromFile(filePath, label) {
  return readSecretFileSync(filePath, label, {
    maxBytes: MAX_SECRET_FILE_BYTES,
    rejectSymlink: true,
  });
}
//#endregion
export { readSecretFromFile as t };
