import fs from "node:fs/promises";
import path from "node:path";
//#region src/memory/root-memory-files.ts
/** Canonical root memory file name used by current workspaces. */
const CANONICAL_ROOT_MEMORY_FILENAME = "MEMORY.md";
/** Legacy root memory file name kept out of auxiliary scans. */
const LEGACY_ROOT_MEMORY_FILENAME = "memory.md";
const ROOT_MEMORY_REPAIR_RELATIVE_DIR = ".openclaw-repair/root-memory";
/** Resolves the canonical root memory file path for a workspace. */
function resolveCanonicalRootMemoryPath(workspaceDir) {
  return path.join(workspaceDir, CANONICAL_ROOT_MEMORY_FILENAME);
}
/** Resolves the legacy root memory file path for a workspace. */
function resolveLegacyRootMemoryPath(workspaceDir) {
  return path.join(workspaceDir, LEGACY_ROOT_MEMORY_FILENAME);
}
/** Resolves the repair directory used while migrating root memory files. */
function resolveRootMemoryRepairDir(workspaceDir) {
  return path.join(workspaceDir, ".openclaw-repair", "root-memory");
}
function normalizeWorkspaceRelativePath(value) {
  return value.trim().replace(/\\/g, "/").replace(/^\.\//, "");
}
/** Checks for an exact directory entry without case-folded path lookup. */
async function exactWorkspaceEntryExists(dir, name) {
  try {
    return (await fs.readdir(dir)).includes(name);
  } catch {
    return false;
  }
}
/** Resolves the canonical root memory file only when it is a real file, not a symlink. */
async function resolveCanonicalRootMemoryFile(workspaceDir) {
  try {
    const entries = await fs.readdir(workspaceDir, { withFileTypes: true });
    for (const entry of entries)
      if (entry.name === "MEMORY.md" && entry.isFile() && !entry.isSymbolicLink())
        return path.join(workspaceDir, entry.name);
  } catch {}
  return null;
}
/** Skips legacy/repair root memory paths when scanning workspace memory files. */
function shouldSkipRootMemoryAuxiliaryPath(params) {
  const relative = path.relative(params.workspaceDir, params.absPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return false;
  const normalized = normalizeWorkspaceRelativePath(relative);
  return (
    normalized === "memory.md" ||
    normalized === ROOT_MEMORY_REPAIR_RELATIVE_DIR ||
    normalized.startsWith(`${ROOT_MEMORY_REPAIR_RELATIVE_DIR}/`)
  );
}
//#endregion
export {
  resolveCanonicalRootMemoryPath as a,
  shouldSkipRootMemoryAuxiliaryPath as c,
  resolveCanonicalRootMemoryFile as i,
  LEGACY_ROOT_MEMORY_FILENAME as n,
  resolveLegacyRootMemoryPath as o,
  exactWorkspaceEntryExists as r,
  resolveRootMemoryRepairDir as s,
  CANONICAL_ROOT_MEMORY_FILENAME as t,
};
