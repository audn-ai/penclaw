import { t as PairingChannel } from "./pairing-store.types-Be-qiql4.js";
import { t as ChannelPairingAdapter } from "./pairing.types-WpVktPzR.js";

//#region src/pairing/pairing-challenge.d.ts
type PairingMeta = Record<string, string | undefined>;
type PairingChallengeParams = {
  channel: string;
  accountId?: string;
  senderId: string;
  senderIdLine: string;
  meta?: PairingMeta;
  upsertPairingRequest: (params: { id: string; meta?: PairingMeta }) => Promise<{
    code: string;
    created: boolean;
  }>;
  sendPairingReply: (text: string) => Promise<void>;
  buildReplyText?: (params: { code: string; senderIdLine: string }) => string;
  onCreated?: (params: { code: string }) => void;
  onReplyError?: (err: unknown) => void;
};
/**
 * Shared pairing challenge issuance for DM pairing policy pathways.
 * Ensures every channel follows the same create-if-missing + reply flow.
 */
declare function issuePairingChallenge(params: PairingChallengeParams): Promise<{
  created: boolean;
  code?: string;
}>;
//#endregion
//#region src/pairing/pairing-store.d.ts
/** @deprecated Compatibility helper for doctor/plugin migrations of the retired JSON store. */
declare function resolveChannelAllowFromPath(
  channel: PairingChannel,
  env?: NodeJS.ProcessEnv,
  accountId?: string,
): string;
type PairingRequest = {
  id: string;
  code: string;
  createdAt: string;
  lastSeenAt: string;
  meta?: Record<string, string>;
};
declare function readChannelAllowFromStore(
  channel: PairingChannel,
  env?: NodeJS.ProcessEnv,
  accountId?: string,
): Promise<string[]>;
declare function readChannelAllowFromStoreSync(
  channel: PairingChannel,
  env?: NodeJS.ProcessEnv,
  accountId?: string,
): string[];
type AllowFromStoreEntryUpdateParams = {
  channel: PairingChannel;
  entry: string | number;
  accountId?: string;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
};
declare function addChannelAllowFromStoreEntry(params: AllowFromStoreEntryUpdateParams): Promise<{
  changed: boolean;
  allowFrom: string[];
}>;
declare function removeChannelAllowFromStoreEntry(
  params: AllowFromStoreEntryUpdateParams,
): Promise<{
  changed: boolean;
  allowFrom: string[];
}>;
declare function listChannelPairingRequests(
  channel: PairingChannel,
  env?: NodeJS.ProcessEnv,
  accountId?: string,
): Promise<PairingRequest[]>;
declare function upsertChannelPairingRequest(params: {
  channel: PairingChannel;
  id: string | number;
  accountId: string;
  meta?: Record<string, string | undefined | null>;
  env?: NodeJS.ProcessEnv /** Extension channels can pass their adapter directly to bypass registry lookup. */;
  pairingAdapter?: ChannelPairingAdapter;
}): Promise<{
  code: string;
  created: boolean;
}>;
declare function approveChannelPairingCode(params: {
  channel: PairingChannel;
  code: string;
  accountId?: string;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
}): Promise<{
  id: string;
  entry?: PairingRequest;
} | null>;
//#endregion
export {
  readChannelAllowFromStore as a,
  resolveChannelAllowFromPath as c,
  issuePairingChallenge as d,
  listChannelPairingRequests as i,
  upsertChannelPairingRequest as l,
  addChannelAllowFromStoreEntry as n,
  readChannelAllowFromStoreSync as o,
  approveChannelPairingCode as r,
  removeChannelAllowFromStoreEntry as s,
  PairingRequest as t,
  PairingChallengeParams as u,
};
