//#region src/skills/runtime/refresh-state.d.ts
type SkillsChangeEvent = {
  workspaceDir?: string;
  reason: "watch" | "watch-targets" | "manual" | "remote-node" | "config-change" | "workshop";
  changedPath?: string;
};
declare function registerSkillsChangeListener(
  listener: (event: SkillsChangeEvent) => void,
): () => void;
declare function bumpSkillsSnapshotVersion(params?: {
  workspaceDir?: string;
  reason?: SkillsChangeEvent["reason"];
  changedPath?: string;
}): number;
declare function getSkillsSnapshotVersion(workspaceDir?: string): number;
declare function shouldRefreshSnapshotForVersion(
  cachedVersion?: number,
  nextVersion?: number,
): boolean;
//#endregion
export {
  type SkillsChangeEvent,
  bumpSkillsSnapshotVersion,
  getSkillsSnapshotVersion,
  registerSkillsChangeListener,
  shouldRefreshSnapshotForVersion,
};
