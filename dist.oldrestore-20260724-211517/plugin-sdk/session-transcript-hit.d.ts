import { t as loadCombinedSessionStoreForGateway } from "../combined-store-gateway-BHX30Uu5.js";
import {
  a as SessionTranscriptMemoryHitKeyParams,
  c as parseSessionTranscriptMemoryHitKey,
  i as SessionTranscriptMemoryHitKey,
  l as resolveSessionTranscriptMemoryHitKeyToSessionKeys,
  n as SessionTranscriptIdentity,
  o as SessionTranscriptReadParams,
  r as SessionTranscriptMemoryHitIdentity,
  s as formatSessionTranscriptMemoryHitKey,
  t as ResolveSessionTranscriptMemoryHitKeyParams,
} from "../session-transcript-memory-hit-BV393OL4.js";
import { s as SessionEntry } from "../types-Dk-ocvLl.js";

//#region src/plugin-sdk/session-transcript-hit.d.ts
/** Canonical session identity parsed from a transcript search-hit path. */
type SessionTranscriptHitIdentity = {
  stem: string;
  liveStem?: string;
  ownerAgentId?: string;
  archived: boolean;
};
/**
 * Derive transcript stem `S` from a memory search hit path for `source === "sessions"`.
 * Builtin index uses `sessions/<basename>.jsonl`; QMD exports use `<stem>.md`.
 * Archived transcripts (`.jsonl.reset.<iso>` / `.jsonl.deleted.<iso>`) resolve
 * to the same stem as the live `.jsonl` they were rotated from.
 */
declare function extractTranscriptStemFromSessionsMemoryHit(hitPath: string): string | null;
/** Parse live/archive ownership metadata from a sessions-memory hit path. */
declare function extractTranscriptIdentityFromSessionsMemoryHit(
  hitPath: string,
): SessionTranscriptHitIdentity | null;
/**
 * Map transcript stem to canonical session store keys (all agents in the combined store).
 * Session tools visibility and agent-to-agent policy are enforced by the caller (e.g.
 * `createSessionVisibilityGuard`), including cross-agent cases.
 */
declare function resolveTranscriptStemToSessionKeys(params: {
  store: Record<string, SessionEntry>;
  stem: string;
  archivedOwnerAgentId?: string;
  allowQmdSlugFallback?: boolean;
}): string[];
//#endregion
export {
  type ResolveSessionTranscriptMemoryHitKeyParams,
  SessionTranscriptHitIdentity,
  type SessionTranscriptIdentity,
  type SessionTranscriptMemoryHitIdentity,
  type SessionTranscriptMemoryHitKey,
  type SessionTranscriptMemoryHitKeyParams,
  type SessionTranscriptReadParams,
  extractTranscriptIdentityFromSessionsMemoryHit,
  extractTranscriptStemFromSessionsMemoryHit,
  formatSessionTranscriptMemoryHitKey,
  loadCombinedSessionStoreForGateway,
  parseSessionTranscriptMemoryHitKey,
  resolveSessionTranscriptMemoryHitKeyToSessionKeys,
  resolveTranscriptStemToSessionKeys,
};
