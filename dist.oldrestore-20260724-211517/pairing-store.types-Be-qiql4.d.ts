import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { t as ChannelPairingAdapter } from "./pairing.types-WpVktPzR.js";

//#region src/pairing/pairing-store.types.d.ts
type PairingChannel = ChannelId;
/** Reads approved ids from a channel/account allowFrom store. */
type ReadChannelAllowFromStoreForAccount = (params: {
  channel: PairingChannel;
  accountId: string;
  env?: NodeJS.ProcessEnv;
}) => Promise<string[]>;
/** Creates or reuses a pending pairing request for one channel account. */
type UpsertChannelPairingRequestForAccount = (params: {
  channel: PairingChannel;
  id: string | number;
  accountId: string;
  meta?: Record<string, string | undefined | null>;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
}) => Promise<{
  code: string;
  created: boolean;
}>;
//#endregion
export {
  ReadChannelAllowFromStoreForAccount as n,
  UpsertChannelPairingRequestForAccount as r,
  PairingChannel as t,
};
