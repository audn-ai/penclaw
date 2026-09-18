import { s as SessionEntry } from "./types-Dk-ocvLl.js";

//#region src/plugin-sdk/session-transcript-memory-hit.d.ts
type SessionTranscriptIdentity = {
  agentId: string;
  memoryKey: SessionTranscriptMemoryHitKey;
  sessionId: string;
  sessionKey: string;
};
type SessionTranscriptMemoryHitIdentity = {
  agentId: string;
  key: SessionTranscriptMemoryHitKey;
  sessionId: string;
};
type SessionTranscriptMemoryHitKey = `transcript:${string}:${string}`;
type SessionTranscriptReadParams = {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  hydrateSkillPromptRefs?: boolean;
  sessionId: string;
  sessionKey: string;
  storePath?: string;
  threadId?: string | number;
};
type SessionTranscriptMemoryHitKeyParams = {
  agentId: string;
  sessionId: string;
};
type ResolveSessionTranscriptMemoryHitKeyParams = {
  includeSyntheticFallback?: boolean;
  key: string;
  store: Record<string, SessionEntry>;
};
/**
 * Builds the memory hit key for one session transcript.
 */
declare function formatSessionTranscriptMemoryHitKey(
  params: SessionTranscriptMemoryHitKeyParams,
): SessionTranscriptMemoryHitKey;
/**
 * Parses a session transcript memory hit key.
 */
declare function parseSessionTranscriptMemoryHitKey(
  key: string,
): SessionTranscriptMemoryHitIdentity | null;
/**
 * Maps a session transcript memory hit key back to visible session store keys.
 */
declare function resolveSessionTranscriptMemoryHitKeyToSessionKeys(
  params: ResolveSessionTranscriptMemoryHitKeyParams,
): string[];
//#endregion
export {
  SessionTranscriptMemoryHitKeyParams as a,
  parseSessionTranscriptMemoryHitKey as c,
  SessionTranscriptMemoryHitKey as i,
  resolveSessionTranscriptMemoryHitKeyToSessionKeys as l,
  SessionTranscriptIdentity as n,
  SessionTranscriptReadParams as o,
  SessionTranscriptMemoryHitIdentity as r,
  formatSessionTranscriptMemoryHitKey as s,
  ResolveSessionTranscriptMemoryHitKeyParams as t,
};
