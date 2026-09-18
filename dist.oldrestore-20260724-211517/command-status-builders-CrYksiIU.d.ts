import { t as SkillCommandSpec } from "./types-9R5xAbjv.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/auto-reply/command-status-builders.d.ts
/** Builds the compact slash-command help text shown by `/help`. */
declare function buildHelpMessage(cfg?: OpenClawConfig): string;
/** Options for rendering `/commands` output for a specific channel surface. */
type CommandsMessageOptions = {
  page?: number;
  surface?: string;
  forcePaginatedList?: boolean;
};
/** Rendered `/commands` text plus pagination metadata for channel-native lists. */
type CommandsMessageResult = {
  text: string;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
};
/** Builds `/commands` text, returning only the rendered message body. */
declare function buildCommandsMessage(
  cfg?: OpenClawConfig,
  skillCommands?: SkillCommandSpec[],
  options?: CommandsMessageOptions,
): string;
/** Builds `/commands` text and pagination metadata for surfaces with native list controls. */
declare function buildCommandsMessagePaginated(
  cfg?: OpenClawConfig,
  skillCommands?: SkillCommandSpec[],
  options?: CommandsMessageOptions,
): CommandsMessageResult;
//#endregion
export {
  buildHelpMessage as a,
  buildCommandsMessagePaginated as i,
  CommandsMessageResult as n,
  buildCommandsMessage as r,
  CommandsMessageOptions as t,
};
