import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
//#region src/channels/direct-dm-guard-policy.ts
/**
 * Direct-DM pre-crypto guard policy.
 *
 * Defines conservative shape, size, timestamp, and rate limits before decryption work starts.
 */
/** Builds the shared policy object for DM-style pre-crypto guardrails. */
function createDirectDmPreCryptoGuardPolicy(overrides = {}) {
  return {
    allowedKinds: overrides.allowedKinds ?? [4],
    maxFutureSkewSec: resolveIntegerOption(overrides.maxFutureSkewSec, 120, { min: 0 }),
    maxCiphertextBytes: resolveIntegerOption(overrides.maxCiphertextBytes, 16 * 1024, { min: 1 }),
    maxPlaintextBytes: resolveIntegerOption(overrides.maxPlaintextBytes, 8 * 1024, { min: 1 }),
    rateLimit: {
      windowMs: resolveIntegerOption(overrides.rateLimit?.windowMs, 6e4, { min: 1 }),
      maxPerSenderPerWindow: resolveIntegerOption(overrides.rateLimit?.maxPerSenderPerWindow, 20, {
        min: 1,
      }),
      maxGlobalPerWindow: resolveIntegerOption(overrides.rateLimit?.maxGlobalPerWindow, 200, {
        min: 1,
      }),
      maxTrackedSenderKeys: resolveIntegerOption(overrides.rateLimit?.maxTrackedSenderKeys, 4096, {
        min: 1,
      }),
    },
  };
}
//#endregion
export { createDirectDmPreCryptoGuardPolicy as t };
