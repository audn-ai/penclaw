import { t as getChatCommands } from "./commands-registry.data-uuI1tQ04.js";
import { t as isCommandFlagEnabled } from "./commands.flags-CxQ7a14j.js";
//#region src/auto-reply/commands-registry-list.ts
/** Command-list assembly and config filtering for chat command registries. */
/** Builds dynamic command definitions exported by installed skills. */
function buildSkillCommandDefinitions(skillCommands) {
  if (!skillCommands || skillCommands.length === 0) return [];
  return skillCommands.map((spec) => {
    const command = {
      key: `skill:${spec.skillName}`,
      nativeName: spec.name,
      description: spec.description,
      textAliases: [`/${spec.name}`],
      acceptsArgs: true,
      argsParsing: "none",
      scope: "both",
      category: "tools",
    };
    if (spec.descriptionLocalizations)
      command.descriptionLocalizations = spec.descriptionLocalizations;
    return command;
  });
}
/** Lists built-in commands plus optional skill-provided commands. */
function listChatCommands(params) {
  const commands = getChatCommands();
  if (!params?.skillCommands?.length) return [...commands];
  return [...commands, ...buildSkillCommandDefinitions(params.skillCommands)];
}
/** Applies config feature flags to command keys that can be operator-disabled. */
function isCommandEnabled(cfg, commandKey) {
  if (commandKey === "config") return isCommandFlagEnabled(cfg, "config");
  if (commandKey === "mcp") return isCommandFlagEnabled(cfg, "mcp");
  if (commandKey === "plugins") return isCommandFlagEnabled(cfg, "plugins");
  if (commandKey === "debug") return isCommandFlagEnabled(cfg, "debug");
  if (commandKey === "bash") return isCommandFlagEnabled(cfg, "bash");
  return true;
}
/** Lists commands visible for a specific config, preserving dynamic skill commands. */
function listChatCommandsForConfig(cfg, params) {
  const base = getChatCommands().filter((command) => isCommandEnabled(cfg, command.key));
  if (!params?.skillCommands?.length) return base;
  return [...base, ...buildSkillCommandDefinitions(params.skillCommands)];
}
//#endregion
export { listChatCommands as n, listChatCommandsForConfig as r, isCommandEnabled as t };
