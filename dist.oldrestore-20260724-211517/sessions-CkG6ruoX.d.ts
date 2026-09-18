import { i as MsgContext } from "./templating-h3OQefFR.js";
import { l as SessionScope, r as GroupKeyResolution } from "./types-Dk-ocvLl.js";
//#region src/config/sessions/group.d.ts
/**
 * Resolves channel/group chat context into the persisted group session key.
 *
 * Provider-prefixed ids use channel-owned normalization, while legacy plugin resolvers remain a
 * fallback for older channel surfaces that cannot yet express the generic route shape.
 */
declare function resolveGroupSessionKey(ctx: MsgContext): GroupKeyResolution | null;
//#endregion
//#region src/config/sessions/artifacts.d.ts
/** Returns true for archived session artifacts and legacy store backup names. */
declare function isSessionArchiveArtifactName(fileName: string): boolean;
/** Returns true for transcript files counted in usage, including reset/deleted archives. */
declare function isUsageCountedSessionTranscriptFileName(fileName: string): boolean;
/** Extracts the session id from a usage-counted transcript filename. */
declare function parseUsageCountedSessionIdFromFileName(fileName: string): string | null;
//#endregion
//#region src/config/sessions/main-session.d.ts
/** Canonicalizes main-session aliases to the current scoped session key. */
declare function canonicalizeMainSessionAlias(params: {
  cfg?: {
    session?: {
      scope?: SessionScope;
      mainKey?: string;
    };
  };
  agentId: string;
  sessionKey: string;
}): string;
//#endregion
export {
  resolveGroupSessionKey as a,
  parseUsageCountedSessionIdFromFileName as i,
  isSessionArchiveArtifactName as n,
  isUsageCountedSessionTranscriptFileName as r,
  canonicalizeMainSessionAlias as t,
};
