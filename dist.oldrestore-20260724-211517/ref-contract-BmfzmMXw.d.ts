import { g as SecretRefSource, h as SecretRef } from "./types.secrets-C15Z_eLX.js";

//#region src/secrets/ref-contract.d.ts
/** Minimal config shape needed to resolve default provider aliases for a secret source. */
type SecretRefDefaultsCarrier = {
  /** Secrets config subset; callers pass full config objects or narrow test doubles. */ secrets?: {
    /** Explicit per-source provider aliases selected by the operator. */ defaults?: {
      /** Default provider alias for environment-variable secret refs. */ env?: string /** Default provider alias for file-backed secret refs. */;
      file?: string /** Default provider alias for exec-backed secret refs. */;
      exec?: string;
    } /** Provider declarations used only when callers ask to prefer the first matching source. */;
    providers?: Record<
      string,
      {
        source?: string;
      }
    >;
  };
};
/** Builds the stable map key used to cache or compare resolved secret refs. */
/** Resolves the default provider alias for one source, falling back to the built-in alias. */
declare function resolveDefaultSecretProviderAlias(
  config: SecretRefDefaultsCarrier,
  source: SecretRefSource,
  options?: {
    preferFirstProviderForSource?: boolean;
  },
): string;
/** Validates a complete SecretRef against the shared provider/source/id grammar. */
declare function isValidSecretRef(ref: SecretRef): boolean;
//#endregion
export { resolveDefaultSecretProviderAlias as n, isValidSecretRef as t };
