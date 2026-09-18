//#region src/infra/secure-random.d.ts
/** Generates a cryptographically secure UUID for runtime ids and cache keys. */
declare function generateSecureUuid(): string;
/** Generates a URL-safe cryptographic token from the requested byte count. */
declare function generateSecureToken(bytes?: number): string;
/** Generates a hex-encoded cryptographic token from the requested byte count. */
declare function generateSecureHex(bytes?: number): string;
/** Returns a cryptographically secure fraction in the range [0, 1). */
declare function generateSecureFraction(): number;
/** Generates a cryptographically secure integer in `[0, maxExclusive)`. */
declare function generateSecureInt(maxExclusive: number): number;
/** Generates a cryptographically secure integer in `[minInclusive, maxExclusive)`. */
declare function generateSecureInt(minInclusive: number, maxExclusive: number): number;
//#endregion
export {
  generateSecureUuid as a,
  generateSecureToken as i,
  generateSecureHex as n,
  generateSecureInt as r,
  generateSecureFraction as t,
};
