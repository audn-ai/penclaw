//#region extensions/migrate-claude/source.d.ts
type ClaudeArchivePath = {
  id: string;
  path: string;
  relativePath: string;
};
type ClaudeAutoMemorySource = {
  id: string;
  label: string;
  path: string;
};
declare const CLAUDE_AUTO_MEMORY_MAX_FILES = 2000;
declare const CLAUDE_AUTO_MEMORY_MAX_SCAN_ENTRIES = 20000;
type ClaudeSource = {
  root: string;
  confidence: "low" | "medium" | "high";
  homeDir?: string;
  projectDir?: string;
  homeProjectsDir?: string;
  userSettingsPath?: string;
  userLocalSettingsPath?: string;
  userClaudeJsonPath?: string;
  userMemoryPath?: string;
  projectSettingsPath?: string;
  projectLocalSettingsPath?: string;
  projectMcpPath?: string;
  projectMemoryPath?: string;
  projectDotClaudeMemoryPath?: string;
  projectLocalMemoryPath?: string;
  projectRulesDir?: string;
  userSkillsDir?: string;
  projectSkillsDir?: string;
  userCommandsDir?: string;
  projectCommandsDir?: string;
  userAgentsDir?: string;
  projectAgentsDir?: string;
  desktopConfigPath?: string;
  autoMemorySources: ClaudeAutoMemorySource[];
  archivePaths: ClaudeArchivePath[];
};
declare function discoverClaudeSource(input?: string): Promise<ClaudeSource>;
declare function hasClaudeSource(source: ClaudeSource): boolean;
//#endregion
export {
  discoverClaudeSource as a,
  ClaudeSource as i,
  CLAUDE_AUTO_MEMORY_MAX_SCAN_ENTRIES as n,
  hasClaudeSource as o,
  ClaudeAutoMemorySource as r,
  CLAUDE_AUTO_MEMORY_MAX_FILES as t,
};
