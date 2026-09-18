import path from "node:path";
import { t as resolveSkillRuntimeConfig } from "./runtime-config-CormhB1-.js";
import { o as loadWorkspaceSkillEntries } from "./workspace-DR7anktc.js";
//#region src/skills/runtime/embedded-run-entries.ts
/** Resolves skill entries embedded into a run payload into runtime-visible entries. */
function resolveEmbeddedRunSkillEntries(params) {
  const shouldLoadSkillEntries = !params.skillsSnapshot || !params.skillsSnapshot.resolvedSkills;
  const config = resolveSkillRuntimeConfig(params.config);
  return {
    shouldLoadSkillEntries,
    skillEntries: shouldLoadSkillEntries
      ? loadWorkspaceSkillEntries(params.workspaceDir, {
          config,
          agentId: params.agentId,
          ...(params.eligibility ? { eligibility: params.eligibility } : {}),
          ...(params.workspaceOnly === true ? { workspaceOnly: true } : {}),
        })
      : [],
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/sandbox-skills.ts
/**
 * Sandbox skill runtime input selection.
 *
 * Sandboxed runs must build prompt-facing skill entries from readable in-sandbox
 * copies instead of reusing host-path snapshots.
 */
const MATERIALIZED_SKILLS_WORKSPACE_CONTAINER_PARTS = [".openclaw", "sandbox-skills"];
function containerJoin(root, ...parts) {
  const normalizedRoot = root.replace(/\\/g, "/").replace(/\/+$/, "") || "/";
  const suffix = parts
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return suffix ? `${normalizedRoot}/${suffix}` : normalizedRoot;
}
function pathEscapesRoot(relativePath) {
  return (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  );
}
function mapPathFromWorkspaceToContainer(params) {
  if (!params.filePath || !path.isAbsolute(params.filePath)) return params.filePath;
  const relativePath = path.relative(
    path.resolve(params.sourceWorkspaceDir),
    path.resolve(params.filePath),
  );
  if (pathEscapesRoot(relativePath)) return params.filePath;
  if (!relativePath) return params.targetWorkspaceDir.replace(/\\/g, "/");
  return containerJoin(params.targetWorkspaceDir, ...relativePath.split(path.sep).filter(Boolean));
}
function mapSandboxSkillEntriesForPrompt(params) {
  if (!params.entries || params.skillsWorkspaceDir === params.skillsPromptWorkspaceDir)
    return params.entries;
  return params.entries.map((entry) => {
    const filePath =
      mapPathFromWorkspaceToContainer({
        filePath: entry.skill.filePath,
        sourceWorkspaceDir: params.skillsWorkspaceDir,
        targetWorkspaceDir: params.skillsPromptWorkspaceDir,
      }) ?? entry.skill.filePath;
    const baseDir =
      mapPathFromWorkspaceToContainer({
        filePath: entry.skill.baseDir,
        sourceWorkspaceDir: params.skillsWorkspaceDir,
        targetWorkspaceDir: params.skillsPromptWorkspaceDir,
      }) ?? entry.skill.baseDir;
    const sourceInfoPath =
      mapPathFromWorkspaceToContainer({
        filePath: entry.skill.sourceInfo.path,
        sourceWorkspaceDir: params.skillsWorkspaceDir,
        targetWorkspaceDir: params.skillsPromptWorkspaceDir,
      }) ?? entry.skill.sourceInfo.path;
    const sourceInfoBaseDir = mapPathFromWorkspaceToContainer({
      filePath: entry.skill.sourceInfo.baseDir,
      sourceWorkspaceDir: params.skillsWorkspaceDir,
      targetWorkspaceDir: params.skillsPromptWorkspaceDir,
    });
    return {
      ...entry,
      skill: {
        ...entry.skill,
        filePath,
        baseDir,
        sourceInfo: {
          ...entry.skill.sourceInfo,
          path: sourceInfoPath,
          ...(sourceInfoBaseDir === void 0 ? {} : { baseDir: sourceInfoBaseDir }),
        },
      },
    };
  });
}
function mapSandboxSkillUsagePaths(params) {
  if (!params.paths || params.skillsWorkspaceDir === params.skillsPromptWorkspaceDir)
    return params.paths;
  return params.paths.map((entry) => ({
    ...entry,
    readPath:
      mapPathFromWorkspaceToContainer({
        filePath: entry.readPath,
        sourceWorkspaceDir: params.skillsWorkspaceDir,
        targetWorkspaceDir: params.skillsPromptWorkspaceDir,
      }) ?? entry.readPath,
  }));
}
function resolveSandboxSkillRuntimeInputs(params) {
  if (params.sandbox?.enabled === true) {
    const skillsWorkspaceDir = params.sandbox.skillsWorkspaceDir ?? params.effectiveWorkspace;
    const skillsPromptWorkspaceDir =
      params.sandbox.workspaceAccess === "rw" &&
      params.sandbox.skillsWorkspaceDir &&
      params.sandbox.containerWorkdir
        ? containerJoin(
            params.sandbox.containerWorkdir,
            ...MATERIALIZED_SKILLS_WORKSPACE_CONTAINER_PARTS,
          )
        : (params.sandbox.containerWorkdir ?? skillsWorkspaceDir);
    return {
      ...(params.sandbox.skillsEligibility
        ? { skillsEligibility: params.sandbox.skillsEligibility }
        : {}),
      skillsPromptWorkspaceDir,
      skillsSnapshot: void 0,
      skillsWorkspaceDir,
      workspaceOnly: true,
    };
  }
  return {
    skillsPromptWorkspaceDir: params.effectiveWorkspace,
    skillsSnapshot: params.skillsSnapshot,
    skillsWorkspaceDir: params.effectiveWorkspace,
    workspaceOnly: false,
  };
}
//#endregion
export {
  resolveEmbeddedRunSkillEntries as i,
  mapSandboxSkillUsagePaths as n,
  resolveSandboxSkillRuntimeInputs as r,
  mapSandboxSkillEntriesForPrompt as t,
};
