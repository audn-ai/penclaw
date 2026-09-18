import fs from "node:fs/promises";
import path from "node:path";
import { f as sanitizeName, r as exists } from "./helpers-DtCn6Wrs.js";
import {
  n as MIGRATION_REASON_TARGET_EXISTS,
  o as createMigrationItem,
} from "./migration-nGWjmzKy.js";
//#region extensions/migrate-hermes/skills.ts
const EXCLUDED_SKILL_DIRS = /* @__PURE__ */ new Set([
  ".git",
  ".github",
  ".hub",
  ".archive",
  ".venv",
  "venv",
  "node_modules",
  "site-packages",
  "__pycache__",
  ".tox",
  ".nox",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
]);
const SKILL_SUPPORT_DIRS = /* @__PURE__ */ new Set([
  "references",
  "templates",
  "assets",
  "scripts",
]);
async function discoverSkillRoots(root) {
  const hasSkill = await exists(path.join(root, "SKILL.md"));
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
  const roots = hasSkill ? [root] : [];
  for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
    if (
      !entry.isDirectory() ||
      EXCLUDED_SKILL_DIRS.has(entry.name) ||
      (hasSkill && SKILL_SUPPORT_DIRS.has(entry.name))
    )
      continue;
    roots.push(...(await discoverSkillRoots(path.join(root, entry.name))));
  }
  return roots;
}
async function buildSkillItems(params) {
  if (!params.source.skillsDir) return [];
  const plannedSkills = [];
  for (const source of await discoverSkillRoots(params.source.skillsDir)) {
    const name = sanitizeName(path.basename(source));
    if (!name) continue;
    plannedSkills.push({
      id: `skill:${path.relative(params.source.skillsDir, source).split(path.sep).map(sanitizeName).filter(Boolean).join(":")}`,
      name,
      source,
      target: path.join(params.targets.workspaceDir, "skills", name),
    });
  }
  const counts = /* @__PURE__ */ new Map();
  for (const skill of plannedSkills) counts.set(skill.name, (counts.get(skill.name) ?? 0) + 1);
  const items = [];
  for (const skill of plannedSkills) {
    const collides = (counts.get(skill.name) ?? 0) > 1;
    const targetExists = await exists(skill.target);
    items.push(
      createMigrationItem({
        id: skill.id,
        kind: "skill",
        action: "copy",
        source: skill.source,
        target: skill.target,
        status: collides ? "conflict" : targetExists && !params.overwrite ? "conflict" : "planned",
        reason: collides
          ? `multiple Hermes skill directories normalize to "${skill.name}"`
          : targetExists && !params.overwrite
            ? MIGRATION_REASON_TARGET_EXISTS
            : void 0,
      }),
    );
  }
  return items;
}
//#endregion
export { buildSkillItems as t };
