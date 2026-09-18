import { n as BaseTokenResolution } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/telegram/src/token.d.ts
type TelegramTokenSource = "env" | "tokenFile" | "config" | "none";
type TelegramTokenResolution = BaseTokenResolution & {
  source: TelegramTokenSource;
};
declare function resolveTelegramBotUserIdFromToken(token?: string): number | undefined;
type ResolveTelegramTokenOpts = {
  envToken?: string | null;
  accountId?: string | null;
  logMissingFile?: (message: string) => void;
};
declare function resolveTelegramToken(
  cfg?: OpenClawConfig,
  opts?: ResolveTelegramTokenOpts,
): TelegramTokenResolution;
//#endregion
export {
  resolveTelegramBotUserIdFromToken as n,
  resolveTelegramToken as r,
  TelegramTokenResolution as t,
};
