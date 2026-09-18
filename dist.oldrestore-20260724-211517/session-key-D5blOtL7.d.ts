import { i as MsgContext } from "./templating-h3OQefFR.js";
import { l as SessionScope } from "./types-Dk-ocvLl.js";

//#region src/config/sessions/paths.d.ts
declare function resolveSessionTranscriptsDirForAgent(
  agentId?: string,
  env?: NodeJS.ProcessEnv,
  homedir?: () => string,
): string;
declare function resolveStorePath(
  store?: string,
  opts?: {
    agentId?: string;
    env?: NodeJS.ProcessEnv;
  },
): string;
//#endregion
//#region src/config/sessions/session-key.d.ts
/**
 * Derives the raw session bucket from message context before agent/main-key normalization.
 *
 * Direct chats use sender identity, groups use channel-owned group keys, and global scope bypasses
 * sender routing entirely.
 */
declare function deriveSessionKey(scope: SessionScope, ctx: MsgContext): string;
/**
 * Resolves the persisted session-store key for an inbound message.
 *
 * Explicit session keys pass through the compatibility normalizer, direct chats collapse to the
 * agent's canonical main bucket, and group/channel sessions stay isolated under the same agent.
 */
declare function resolveSessionKey(
  scope: SessionScope,
  ctx: MsgContext,
  mainKey?: string,
  agentId?: string,
): string;
//#endregion
export {
  resolveStorePath as i,
  resolveSessionKey as n,
  resolveSessionTranscriptsDirForAgent as r,
  deriveSessionKey as t,
};
