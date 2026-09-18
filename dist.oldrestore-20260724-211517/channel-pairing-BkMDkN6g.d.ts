import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { d as issuePairingChallenge } from "./pairing-store-CaT4kVxr.js";
import { t as ChannelPairingAdapter } from "./pairing.types-WpVktPzR.js";
import { cr as PluginRuntime } from "./types-Ga3mNO_F.js";

//#region src/channels/plugins/pairing-adapters.d.ts
type PairingNotifyParams = Parameters<NonNullable<ChannelPairingAdapter["notifyApproval"]>>[0];
/**
 * Creates an allowlist normalizer that strips a channel-specific target prefix.
 */
declare function createPairingPrefixStripper(
  prefixRe: RegExp,
  map?: (entry: string) => string,
): NonNullable<ChannelPairingAdapter["normalizeAllowEntry"]>;
/**
 * Creates a pairing notifier that logs a formatted approval message.
 */
declare function createLoggedPairingApprovalNotifier(
  format: string | ((params: PairingNotifyParams) => string),
  log?: (message: string) => void,
): NonNullable<ChannelPairingAdapter["notifyApproval"]>;
/**
 * Creates a text-message pairing adapter with optional allowlist normalization.
 */
declare function createTextPairingAdapter(params: {
  idLabel: string;
  message: string;
  normalizeAllowEntry?: ChannelPairingAdapter["normalizeAllowEntry"];
  notify: (
    params: PairingNotifyParams & {
      message: string;
    },
  ) => Promise<void> | void;
}): ChannelPairingAdapter;
//#endregion
//#region src/plugin-sdk/pairing-access.d.ts
type PairingApi = PluginRuntime["channel"]["pairing"];
type ScopedUpsertInput = Omit<
  Parameters<PairingApi["upsertPairingRequest"]>[0],
  "channel" | "accountId"
>;
/** Scope pairing store operations to one channel/account pair for plugin-facing helpers. */
declare function createScopedPairingAccess(params: {
  /** Plugin runtime that owns the channel pairing store API. */ core: PluginRuntime /** Channel id permanently attached to store reads and writes from this helper. */;
  channel: ChannelId /** Channel account id normalized once before store operations. */;
  accountId: string;
}): {
  /** Normalized account id used by every channel-scoped pairing store operation. */ accountId: string /** Read allow-list entries for the scoped channel/account pair. */;
  readAllowFromStore: () => Promise<
    string[]
  > /** Read another channel/account allow-list for DM policy cross-checks. */;
  readStoreForDmPolicy: (
    provider: ChannelId,
    accountId: string,
  ) => Promise<string[]> /** Upsert a pairing request with the scoped channel/account injected. */;
  upsertPairingRequest: (input: ScopedUpsertInput) => Promise<{
    code: string;
    created: boolean;
  }>;
};
//#endregion
//#region src/plugin-sdk/channel-pairing.d.ts
type ScopedPairingAccess = ReturnType<typeof createScopedPairingAccess>;
/** Pairing helpers scoped to one channel account. */
type ChannelPairingController = ScopedPairingAccess & {
  /** Issue a pairing challenge using the controller's channel and scoped store writer. */ issueChallenge: (
    params: Omit<
      Parameters<typeof issuePairingChallenge>[0],
      "channel" | "accountId" | "upsertPairingRequest"
    >,
  ) => ReturnType<typeof issuePairingChallenge>;
};
/** Pre-bind the channel id and storage sink for pairing challenges. */
declare function createChannelPairingChallengeIssuer(params: {
  /** Channel id attached to every challenge issued by the returned helper. */ channel: ChannelId /** Optional channel account id attached to pairing-request hook payloads. */;
  accountId?: string /** Store writer that persists pending pairing requests for the bound channel. */;
  upsertPairingRequest: Parameters<typeof issuePairingChallenge>[0]["upsertPairingRequest"];
}): (
  /** Challenge details supplied at message handling time. */

  challenge: Omit<
    Parameters<typeof issuePairingChallenge>[0],
    "channel" | "accountId" | "upsertPairingRequest"
  >,
) => Promise<{
  created: boolean;
  code?: string;
}>;
/** Build the full scoped pairing controller used by channel runtime code. */
declare function createChannelPairingController(params: {
  /** Plugin runtime that provides pairing store operations. */ core: PluginRuntime /** Channel id scoped into reads, writes, and issued challenges. */;
  channel: ChannelId /** Channel account id normalized before pairing store access. */;
  accountId: string;
}): ChannelPairingController;
//#endregion
export {
  createPairingPrefixStripper as a,
  createLoggedPairingApprovalNotifier as i,
  createChannelPairingChallengeIssuer as n,
  createTextPairingAdapter as o,
  createChannelPairingController as r,
  ChannelPairingController as t,
};
