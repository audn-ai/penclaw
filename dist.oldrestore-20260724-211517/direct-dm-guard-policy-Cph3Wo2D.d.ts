//#region src/channels/direct-dm-guard-policy.d.ts
/** Runtime limits applied before direct-DM encrypted payloads are decrypted. */
type DirectDmPreCryptoGuardPolicy = {
  /** Accepted encrypted event kinds before decryption, e.g. Nostr kind 4. */ allowedKinds: readonly number[] /** Maximum sender timestamp skew allowed into the future. */;
  maxFutureSkewSec: number /** Maximum encrypted payload bytes accepted before decrypt work starts. */;
  maxCiphertextBytes: number /** Maximum decrypted plaintext bytes accepted after decrypt succeeds. */;
  maxPlaintextBytes: number /** Per-sender and global throttles for encrypted DM ingress. */;
  rateLimit: {
    /** Fixed rate-limit window size. */ windowMs: number /** Maximum messages per sender key inside one window. */;
    maxPerSenderPerWindow: number /** Maximum messages across all sender keys inside one window. */;
    maxGlobalPerWindow: number /** Maximum sender keys retained by the in-memory limiter. */;
    maxTrackedSenderKeys: number;
  };
};
/** Partial overrides for channel plugins that need stricter pre-crypto limits. */
type DirectDmPreCryptoGuardPolicyOverrides = Partial<
  Omit<DirectDmPreCryptoGuardPolicy, "rateLimit">
> & {
  rateLimit?: Partial<DirectDmPreCryptoGuardPolicy["rateLimit"]>;
};
/** Builds the shared policy object for DM-style pre-crypto guardrails. */
declare function createDirectDmPreCryptoGuardPolicy(
  overrides?: DirectDmPreCryptoGuardPolicyOverrides,
): DirectDmPreCryptoGuardPolicy;
//#endregion
export {
  DirectDmPreCryptoGuardPolicyOverrides as n,
  createDirectDmPreCryptoGuardPolicy as r,
  DirectDmPreCryptoGuardPolicy as t,
};
