import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/infra/host-directory-listing.ts
async function listDirEntries(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const entries = [];
  for (const dirent of dirents) {
    const entryPath = path.join(dir, dirent.name);
    let isDirectory = dirent.isDirectory();
    if (dirent.isSymbolicLink())
      isDirectory = await fs.stat(entryPath).then(
        (stat) => stat.isDirectory(),
        () => false,
      );
    if (!isDirectory) continue;
    const hidden = dirent.name.startsWith(".");
    entries.push({
      name: dirent.name,
      path: entryPath,
      ...(hidden ? { hidden: true } : {}),
    });
  }
  entries.sort((a, b) => {
    if (Boolean(a.hidden) !== Boolean(b.hidden)) return a.hidden ? 1 : -1;
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
  return entries;
}
/** Lists one absolute host directory, defaulting to that host's home directory. */
async function listHostDirectories(requestedPath) {
  const home = os.homedir();
  const requested = requestedPath?.trim() || home;
  if (!path.isAbsolute(requested)) throw new Error("fs.listDir path must be absolute");
  const resolved = path.resolve(requested);
  const entries = await listDirEntries(resolved);
  const parent = path.dirname(resolved);
  return {
    path: resolved,
    ...(parent !== resolved ? { parent } : {}),
    home,
    entries,
  };
}
//#endregion
export { listHostDirectories as t };
