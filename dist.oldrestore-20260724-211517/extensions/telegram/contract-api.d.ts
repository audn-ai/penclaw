import { f as mergeTelegramAccountConfig } from "../../accounts-B_z9gHZ0.js";
import {
  a as normalizeTelegramCommandName,
  i as normalizeTelegramCommandDescription,
  o as resolveTelegramCustomCommands,
  t as TELEGRAM_COMMAND_NAME_PATTERN,
} from "../../command-config-B5uSKuEF.js";
import {
  a as buildTelegramModelsProviderChannelData,
  i as buildCommandsPaginationKeyboard,
  n as TelegramInteractiveHandlerRegistration,
  r as TelegramInteractiveHandlerResult,
  t as TelegramInteractiveHandlerContext,
} from "../../interactive-dispatch-CnSyXBVc.js";
import { n as parseTelegramTopicConversation } from "../../topic-conversation-DB0Kpc_a.js";

//#region extensions/telegram/src/setup-contract.d.ts
declare const singleAccountKeysToMove: string[];
//#endregion
export {
  TELEGRAM_COMMAND_NAME_PATTERN,
  type TelegramInteractiveHandlerContext,
  type TelegramInteractiveHandlerRegistration,
  type TelegramInteractiveHandlerResult,
  buildCommandsPaginationKeyboard,
  buildTelegramModelsProviderChannelData,
  mergeTelegramAccountConfig,
  normalizeTelegramCommandDescription,
  normalizeTelegramCommandName,
  parseTelegramTopicConversation,
  resolveTelegramCustomCommands,
  singleAccountKeysToMove,
};
