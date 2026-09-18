import { i as ReefFriendConfig, t as ReefChannelConfig } from "./config-schema-DkRYMIlm.js";
import {
  a as ReefKeys,
  c as GuardDirection,
  d as ReplayStore,
  f as SignedReceipt,
  i as ReefIngressMessage,
  l as Verdict,
  o as RelayFriend,
  p as AuditStore,
  s as GuardAdapter,
  t as InboxEntry,
  u as Envelope,
} from "./types-DrH-EmQY.js";

//#region extensions/reef/protocol/pipeline.d.ts
interface ReviewRequest {
  id: string;
  from: string;
  to: string;
  direction: GuardDirection;
  bodyHash: string;
  approvalDigest: string;
  verdict: Verdict;
}
interface ReviewApproval {
  approved: boolean;
  approvalDigest: string;
}
//#endregion
//#region extensions/reef/src/transport.d.ts
type FetchLike = typeof fetch;
declare class ReefTransportClient {
  readonly relayUrl: string;
  readonly handle: string;
  readonly keys: ReefKeys;
  readonly fetcher: FetchLike;
  readonly clock: () => number;
  private lastTs;
  constructor(
    relayUrl: string,
    handle: string,
    keys: ReefKeys,
    fetcher?: FetchLike,
    clock?: () => number,
  );
  authStart(email: string): Promise<{
    status: string;
    magicLink?: string;
  }>;
  authComplete(token: string): Promise<{
    session: string;
    expires: number;
  }>;
  createHandle(
    session: string,
    requestPolicy: string,
  ): Promise<{
    handle: string;
    key_epoch: number;
  }>;
  listOwnHandles(session: string): Promise<{
    handles: Array<{
      handle: string;
      key_epoch: number;
      request_policy: string;
    }>;
  }>;
  mintFriendCode(): Promise<{
    code: string;
    expires: number;
  }>;
  requestFriend(
    to: string,
    code?: string,
  ): Promise<{
    status: string;
  }>;
  respondFriend(
    peer: string,
    accept: boolean,
  ): Promise<{
    peer: string;
    status: string;
  }>;
  listFriends(): Promise<{
    friendships: RelayFriend[];
  }>;
  removeFriend(peer: string): Promise<void>;
  sendEnvelope(
    peer: string,
    envelope: Envelope,
  ): Promise<{
    id: string;
    status: string;
  }>;
  acknowledge(
    peer: string,
    id: string,
    receipt: SignedReceipt,
  ): Promise<{
    result: string;
  }>;
  pull(after: number): Promise<{
    entries: InboxEntry[];
    cursor: number;
  }>;
  websocketUrl(): string;
  signed<T>(method: string, path: string, body?: unknown): Promise<T>;
  private auth;
  private unsigned;
  private request;
}
interface WebSocketLike {
  addEventListener(type: "message", listener: (event: { data: unknown }) => void): void;
  addEventListener(type: "open" | "close" | "error", listener: () => void): void;
  close(): void;
}
declare class ReefInboxConnection {
  readonly client: ReefTransportClient;
  readonly onEntries: (entries: InboxEntry[]) => Promise<void>;
  readonly webSocketFactory: (url: string) => WebSocketLike;
  readonly onState?: ((state: "connected" | "disconnected") => void) | undefined;
  private cursor;
  private stopped;
  constructor(
    client: ReefTransportClient,
    onEntries: (entries: InboxEntry[]) => Promise<void>,
    webSocketFactory: (url: string) => WebSocketLike,
    onState?: ((state: "connected" | "disconnected") => void) | undefined,
  );
  start(signal?: AbortSignal): Promise<void>;
  stop(): void;
  drain(): Promise<void>;
  private live;
}
//#endregion
//#region extensions/reef/src/friends.d.ts
type PairingChallenge = (params: {
  peer: string;
  fingerprint: string;
  code: string;
}) => Promise<void>;
declare class ReefFriendManager {
  #private;
  readonly config: ReefChannelConfig;
  readonly transport: ReefTransportClient;
  readonly stateDir?: string | undefined;
  constructor(
    config: ReefChannelConfig,
    transport: ReefTransportClient,
    stateDir?: string | undefined,
  );
  mintCode(): Promise<{
    code: string;
    expires: number;
  }>;
  request(
    peer: string,
    code?: string,
  ): Promise<{
    status: string;
  }>;
  remove(peer: string): Promise<void>;
  list(): Promise<
    Array<
      RelayFriend & {
        fingerprint: string;
        autonomy?: ReefFriendConfig["autonomy"];
      }
    >
  >;
  surfacePending(issue: PairingChallenge): Promise<void>;
  reconcileApproved(approvedPeers: readonly string[]): Promise<string[]>;
}
//#endregion
//#region extensions/reef/src/state.d.ts
declare class ReviewApprovalStore {
  readonly path: string;
  constructor(stateDir: string);
  request(review: ReviewRequest): Promise<ReviewApproval | undefined>;
  decide(digest: string, approved: boolean): Promise<boolean>;
  list(): Promise<ReviewRequest[]>;
  private read;
}
//#endregion
//#region extensions/reef/src/flow.d.ts
declare class ReefMessageFlow {
  readonly options: {
    config: ReefChannelConfig;
    keys: ReefKeys;
    stateDir: string;
    transport: ReefTransportClient;
    guard: GuardAdapter;
    audit: AuditStore;
    replay: ReplayStore;
    reviews: ReviewApprovalStore;
    onIngress: (message: ReefIngressMessage) => Promise<void>;
    onOwnerNotice: (text: string) => Promise<void>;
  };
  private readonly delivered;
  private deliveredLoaded;
  private readonly ulid;
  constructor(options: {
    config: ReefChannelConfig;
    keys: ReefKeys;
    stateDir: string;
    transport: ReefTransportClient;
    guard: GuardAdapter;
    audit: AuditStore;
    replay: ReplayStore;
    reviews: ReviewApprovalStore;
    onIngress: (message: ReefIngressMessage) => Promise<void>;
    onOwnerNotice: (text: string) => Promise<void>;
  });
  send(
    peer: string,
    text: string,
    context?: {
      thread?: string;
      replyTo?: string;
    },
  ): Promise<string>;
  processEntries(entries: InboxEntry[]): Promise<void>;
  private processEnvelope;
  private loadDelivered;
  private requireHandle;
  private requireGuardConfig;
}
declare function createConfiguredGuard(
  config: ReefChannelConfig,
  fetcher?: typeof fetch,
): GuardAdapter;
//#endregion
export {
  ReefInboxConnection as a,
  ReefFriendManager as i,
  createConfiguredGuard as n,
  ReefTransportClient as o,
  ReviewApprovalStore as r,
  WebSocketLike as s,
  ReefMessageFlow as t,
};
