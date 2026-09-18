import { o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
//#region src/agents/sessions/source-info.ts
/** Converts package-manager path metadata into the session source-info shape. */
function createSourceInfo(path, metadata) {
  return {
    path,
    source: metadata.source,
    scope: metadata.scope,
    origin: metadata.origin,
    baseDir: metadata.baseDir,
  };
}
/** Builds source metadata for generated or synthetic session entries. */
function createSyntheticSourceInfo(path, options) {
  return {
    path,
    source: options.source,
    scope: options.scope ?? "temporary",
    origin: options.origin ?? "top-level",
    baseDir: options.baseDir,
  };
}
//#endregion
//#region src/skills/loading/skill-contract.ts
function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
/**
 * Keep this formatter's XML layout byte-for-byte aligned with the upstream
 * Agent Skills formatter so we can avoid importing the full session runtime
 * package root on the cold skills path. Visibility policy is applied upstream
 * before calling this helper.
 */
function formatSkillsForPrompt(skills) {
  if (skills.length === 0) return "";
  const lines = [
    "\n\nThe following skills provide specialized instructions for specific tasks.",
    "Use the read tool to load a skill's file when the task matches its description.",
    "If a skill's <version> differs from a previous turn, re-read its SKILL.md before using it.",
    "When a skill file references a relative path, resolve it against the skill directory (parent of SKILL.md / dirname of the path) and use that absolute path in tool commands.",
    "",
    "<available_skills>",
  ];
  for (const skill of skills) {
    lines.push("  <skill>");
    lines.push(`    <name>${escapeXml(skill.name)}</name>`);
    lines.push(`    <description>${escapeXml(skill.description)}</description>`);
    lines.push(`    <location>${escapeXml(skill.filePath)}</location>`);
    if (skill.locationNote)
      lines.push(`    <location_note>${escapeXml(skill.locationNote)}</location_note>`);
    if (skill.promptVersion) lines.push(`    <version>${escapeXml(skill.promptVersion)}</version>`);
    lines.push("  </skill>");
  }
  lines.push("</available_skills>");
  return lines.join("\n");
}
//#endregion
//#region src/skills/loading/skill-version.ts
function computeSkillPromptVersion(content) {
  return `sha256:${sha256HexPrefix(content, 16)}`;
}
//#endregion
export {
  createSyntheticSourceInfo as i,
  formatSkillsForPrompt as n,
  createSourceInfo as r,
  computeSkillPromptVersion as t,
};
