import { i as ReplyThreadingPolicy } from "./types-BgrDi5xH.js";
import { E as ReplyToMode } from "./types.base-ibSxQuK3.js";
//#region src/auto-reply/reply/reply-threading.d.ts
/** Build threading policy for batched reply-to mode. */
declare function resolveBatchedReplyThreadingPolicy(
  mode: ReplyToMode,
  isBatched: boolean,
): ReplyThreadingPolicy | undefined;
//#endregion
export { resolveBatchedReplyThreadingPolicy as t };
