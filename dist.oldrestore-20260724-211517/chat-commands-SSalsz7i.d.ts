import { n as ExecSessionDefaults, t as ExecPolicyOverrides } from "./exec-defaults-mW2NZWKv.js";
import { t as SkillCommandSpec } from "./types-9R5xAbjv.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/skills/discovery/chat-command-invocation.d.ts
/** Lists slash command names reserved by built-in chat commands and callers. */
declare function listReservedChatSlashCommandNames(extraNames?: string[]): Set<string>;
declare function resolveSkillCommandInvocation(params: {
  commandBodyNormalized: string;
  skillCommands: SkillCommandSpec[];
}): {
  command: SkillCommandSpec;
  args?: string;
} | null;
//#endregion
//#region src/skills/discovery/chat-commands.d.ts
declare function listSkillCommandsForWorkspace(params: {
  workspaceDir: string;
  cfg: OpenClawConfig;
  agentId?: string;
  skillFilter?: string[];
  sessionEntry?: ExecSessionDefaults;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
}): SkillCommandSpec[];
declare function listSkillCommandsForAgents(params: {
  cfg: OpenClawConfig;
  agentIds?: string[];
  sessionEntry?: ExecSessionDefaults;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
}): SkillCommandSpec[];
//#endregion
export {
  resolveSkillCommandInvocation as i,
  listSkillCommandsForWorkspace as n,
  listReservedChatSlashCommandNames as r,
  listSkillCommandsForAgents as t,
};
