import { n as CommandArgs } from "./commands-args.types-zglMcgeO.js";
import {
  l as NativeCommandSpec,
  r as CommandArgDefinition,
  t as ChatCommandDefinition,
} from "./commands-registry.types-Cxf8RKoB.js";
import { i as ThinkingCatalogEntry } from "./thinking.shared-0bZWY054.js";
import { t as SkillCommandSpec } from "./types-9R5xAbjv.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/auto-reply/commands-registry-list.d.ts
/** Lists built-in commands plus optional skill-provided commands. */
declare function listChatCommands(params?: {
  skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
/** Applies config feature flags to command keys that can be operator-disabled. */
declare function isCommandEnabled(cfg: OpenClawConfig, commandKey: string): boolean;
/** Lists commands visible for a specific config, preserving dynamic skill commands. */
declare function listChatCommandsForConfig(
  cfg: OpenClawConfig,
  params?: {
    skillCommands?: SkillCommandSpec[];
  },
): ChatCommandDefinition[];
//#endregion
//#region src/auto-reply/commands-registry.d.ts
type NativeCommandProviderLookupOptions = {
  includeBundledChannelFallback?: boolean;
};
/** Lists native command specs registered for a provider, including skill commands. */
declare function listNativeCommandSpecs(params?: {
  skillCommands?: SkillCommandSpec[];
  provider?: string;
}): NativeCommandSpec[];
/** Lists native command specs that are enabled for the provided config. */
declare function listNativeCommandSpecsForConfig(
  cfg: OpenClawConfig,
  params?: {
    skillCommands?: SkillCommandSpec[];
    provider?: string;
  },
): NativeCommandSpec[];
/** Finds a command definition by provider-native command name or native alias. */
declare function findCommandByNativeName(
  name: string,
  provider?: string,
  options?: NativeCommandProviderLookupOptions,
): ChatCommandDefinition | undefined;
/** Formats a command and optional raw argument string as slash-command text. */
declare function buildCommandText(commandName: string, args?: string): string;
/** Parses raw command arguments according to the command definition. */
declare function parseCommandArgs(
  command: ChatCommandDefinition,
  raw?: string,
): CommandArgs | undefined;
/** Serializes parsed command arguments back into a raw argument string. */
declare function serializeCommandArgs(
  command: ChatCommandDefinition,
  args?: CommandArgs,
): string | undefined;
/** Builds slash-command text from a command definition and parsed args. */
declare function buildCommandTextFromArgs(
  command: ChatCommandDefinition,
  args?: CommandArgs,
): string;
type ResolvedCommandArgChoice = {
  value: string;
  label: string;
};
/** Resolves static or context-aware choices for one command argument. */
declare function resolveCommandArgChoices(params: {
  command: ChatCommandDefinition;
  arg: CommandArgDefinition;
  cfg?: OpenClawConfig;
  provider?: string;
  model?: string;
  agentRuntime?: string;
  catalog?: ThinkingCatalogEntry[];
}): ResolvedCommandArgChoice[];
/** Resolves the next argument menu to show for commands with selectable choices. */
declare function resolveCommandArgMenu(params: {
  command: ChatCommandDefinition;
  args?: CommandArgs;
  cfg?: OpenClawConfig;
  provider?: string;
  model?: string;
  agentRuntime?: string;
  catalog?: ThinkingCatalogEntry[];
}): {
  arg: CommandArgDefinition;
  choices: ResolvedCommandArgChoice[];
  title?: string;
} | null;
/** Formats the prompt title shown before an argument-choice menu. */
declare function formatCommandArgMenuTitle(params: {
  command: ChatCommandDefinition;
  menu: NonNullable<ReturnType<typeof resolveCommandArgMenu>>;
}): string;
/** Returns true for normalized slash-command text. */
declare function isCommandMessage(raw: string): boolean;
//#endregion
export {
  formatCommandArgMenuTitle as a,
  listNativeCommandSpecsForConfig as c,
  resolveCommandArgMenu as d,
  serializeCommandArgs as f,
  listChatCommandsForConfig as h,
  findCommandByNativeName as i,
  parseCommandArgs as l,
  listChatCommands as m,
  buildCommandText as n,
  isCommandMessage as o,
  isCommandEnabled as p,
  buildCommandTextFromArgs as r,
  listNativeCommandSpecs as s,
  ResolvedCommandArgChoice as t,
  resolveCommandArgChoices as u,
};
