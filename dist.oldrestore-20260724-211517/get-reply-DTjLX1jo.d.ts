import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import { i as MsgContext } from "./templating-h3OQefFR.js";
import { n as GetReplyOptions } from "./types-BgrDi5xH.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig(
  ctx: MsgContext,
  opts?: GetReplyOptions,
  configOverride?: OpenClawConfig,
): Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
export { getReplyFromConfig as t };
