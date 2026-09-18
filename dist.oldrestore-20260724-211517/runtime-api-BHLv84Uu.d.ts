import { l as ExecApprovalRequest } from "./exec-approvals-B59RubLo.js";
import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import { n as MonitorTelegramOpts } from "./runtime-CuY_VuJY.js";
import { v as GroupPolicy } from "./types.base-ibSxQuK3.js";
import { v as TelegramAccountConfig$1 } from "./types.channels-CYB_Xphv.js";
import { v as ChannelMessageActionAdapter } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/telegram/src/bot-access.d.ts
type NormalizedAllowFrom = {
  entries: string[];
  hasWildcard: boolean;
  hasEntries: boolean;
  invalidEntries: string[];
};
//#endregion
//#region extensions/telegram/src/group-access.d.ts
declare const resolveTelegramRuntimeGroupPolicy: (params: {
  providerConfigPresent: boolean;
  groupPolicy?: TelegramAccountConfig$1["groupPolicy"];
  defaultGroupPolicy?: TelegramAccountConfig$1["groupPolicy"];
}) => {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
};
//#endregion
//#region extensions/telegram/src/exec-approval-forwarding.d.ts
declare function shouldSuppressTelegramExecApprovalForwardingFallback(params: {
  cfg: OpenClawConfig;
  target: {
    channel: string;
    accountId?: string | null;
  };
  request: ExecApprovalRequest;
}): boolean;
declare function buildTelegramExecApprovalPendingPayload(params: {
  request: ExecApprovalRequest;
  nowMs: number;
}): ReplyPayload;
//#endregion
//#region extensions/telegram/src/sticker-cache-store.d.ts
interface CachedSticker {
  fileId: string;
  fileUniqueId: string;
  emoji?: string;
  setName?: string;
  description: string;
  cachedAt: string;
  receivedFrom?: string;
}
/**
 * Get a cached sticker by its unique ID.
 */
declare function getCachedSticker(fileUniqueId: string): CachedSticker | null;
/**
 * Add or update a sticker in the cache.
 */
declare function cacheSticker(sticker: CachedSticker): void;
/**
 * Search cached stickers by text query (fuzzy match on description + emoji + setName).
 */
declare function searchStickers(query: string, limit?: number): CachedSticker[];
/**
 * Get all cached stickers (for debugging/listing).
 */
declare function getAllCachedStickers(): CachedSticker[];
/**
 * Get cache statistics.
 */
declare function getCacheStats(): {
  count: number;
  oldestAt?: string;
  newestAt?: string;
};
//#endregion
//#region extensions/telegram/src/sticker-cache.d.ts
interface DescribeStickerParams {
  imagePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  agentId?: string;
}
/**
 * Describe a sticker image using vision API.
 * Auto-detects an available vision provider based on configured API keys.
 * Returns null if no vision provider is available.
 */
declare function describeStickerImage(params: DescribeStickerParams): Promise<string | null>;
//#endregion
//#region extensions/telegram/src/channel-actions.d.ts
declare const telegramMessageActions: ChannelMessageActionAdapter;
//#endregion
//#region extensions/telegram/src/monitor.d.ts
declare function monitorTelegramProvider(opts?: MonitorTelegramOpts): Promise<void>;
//#endregion
//#region extensions/telegram/src/poll-visibility.d.ts
declare function resolveTelegramPollVisibility(params: {
  pollAnonymous?: boolean;
  pollPublic?: boolean;
}): boolean | undefined;
//#endregion
//#region extensions/telegram/runtime-api.d.ts
type TelegramAccountConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["telegram"]>;
type TelegramActionConfig = NonNullable<TelegramAccountConfig["actions"]>;
type TelegramNetworkConfig = NonNullable<TelegramAccountConfig["network"]>;
//#endregion
export {
  resolveTelegramRuntimeGroupPolicy as _,
  monitorTelegramProvider as a,
  describeStickerImage as c,
  getAllCachedStickers as d,
  getCacheStats as f,
  shouldSuppressTelegramExecApprovalForwardingFallback as g,
  buildTelegramExecApprovalPendingPayload as h,
  resolveTelegramPollVisibility as i,
  CachedSticker as l,
  searchStickers as m,
  TelegramActionConfig as n,
  telegramMessageActions as o,
  getCachedSticker as p,
  TelegramNetworkConfig as r,
  DescribeStickerParams as s,
  TelegramAccountConfig as t,
  cacheSticker as u,
  NormalizedAllowFrom as v,
};
