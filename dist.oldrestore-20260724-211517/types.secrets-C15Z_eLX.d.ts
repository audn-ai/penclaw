//#region src/config/types.secrets.d.ts
/** Supported secret reference backends in config. */
type SecretRefSource = "env" | "file" | "exec";
/**
 * Stable identifier for a secret in a configured source.
 * Examples:
 * - env source: provider "default", id "OPENAI_API_KEY"
 * - file source: provider "mounted-json", id "/providers/openai/apiKey"
 * - exec source: provider "vault", id "openai/api-key"
 */
type SecretRef = {
  source: SecretRefSource;
  provider: string;
  id: string;
};
/** Secret-bearing config input: either a literal string or a structured SecretRef. */
type SecretInput = string | SecretRef;
/** Provider alias used when a SecretRef omits a source-specific provider. */
declare const DEFAULT_SECRET_PROVIDER_ALIAS = "default";
/** Strict env-var id shape accepted for env-backed SecretRefs. */
declare const ENV_SECRET_REF_ID_RE: RegExp;
/** Legacy env SecretRef marker retained for config migration/read compatibility. */
declare const LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:";
/** Older env SecretRef marker retained for migration/read compatibility. */
declare const LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX = "__env__:";
/** Secret string read mode: throw on unresolved refs or inspect without resolving. */
type SecretInputStringResolutionMode = "strict" | "inspect";
/** Result of reading a secret input without necessarily materializing the secret value. */
type SecretInputStringResolution =
  | {
      status: "available";
      value: string;
      ref: null;
    }
  | {
      status: "configured_unavailable";
      value: undefined;
      ref: SecretRef;
    }
  | {
      status: "missing";
      value: undefined;
      ref: null;
    };
type SecretDefaults = {
  /** Default provider alias for env SecretRefs. */ env?: string /** Default provider alias for file SecretRefs. */;
  file?: string /** Default provider alias for exec SecretRefs. */;
  exec?: string;
};
/** Return whether an env SecretRef id is a supported uppercase environment variable name. */
declare function isValidEnvSecretRefId(value: string): boolean;
/** Narrow a value to the canonical SecretRef object shape. */
declare function isSecretRef(value: unknown): value is SecretRef;
/** Parse `$NAME` and `${NAME}` env-secret shorthand strings into env SecretRefs. */
declare function parseEnvTemplateSecretRef(value: unknown, provider?: string): SecretRef | null;
/** Parse legacy env SecretRef marker strings kept for config migration/read compatibility. */
declare function parseLegacySecretRefEnvMarker(value: unknown, provider?: string): SecretRef | null;
/** Coerce canonical, legacy, and env-shorthand secret inputs into a SecretRef. */
declare function coerceSecretRef(value: unknown, defaults?: SecretDefaults): SecretRef | null;
/** Return whether a value contains either a literal secret string or resolvable SecretRef shape. */
declare function hasConfiguredSecretInput(value: unknown, defaults?: SecretDefaults): boolean;
/** Trim a literal secret input string while leaving non-string inputs unresolved. */
declare function normalizeSecretInputString(value: unknown): string | undefined;
/** Error thrown when strict secret reads encounter a configured but unresolved SecretRef. */
declare class UnresolvedSecretInputError extends Error {
  readonly path: string;
  readonly ref: SecretRef;
  constructor(params: { path: string; ref: SecretRef });
}
/** Narrow errors from strict secret read sites without parsing user-facing messages. */
declare function isUnresolvedSecretInputError(value: unknown): value is UnresolvedSecretInputError;
/** Throw when a secret field still contains an unresolved SecretRef at a read site. */
declare function assertSecretInputResolved(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
}): void;
/** Resolve a secret field to either a literal value, a configured-unavailable ref, or missing. */
declare function resolveSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
  mode?: SecretInputStringResolutionMode;
}): SecretInputStringResolution;
/** Return a strict literal secret value, throwing if the field still points at a SecretRef. */
declare function normalizeResolvedSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
}): string | undefined;
/** Resolve explicit `refValue` before inline secret references embedded in `value`. */
declare function resolveSecretInputRef(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
}): {
  explicitRef: SecretRef | null;
  inlineRef: SecretRef | null;
  ref: SecretRef | null;
};
type EnvSecretProviderConfig = {
  source: "env" /** Optional env var allowlist (exact names). */;
  allowlist?: string[];
};
type FileSecretProviderMode = "singleValue" | "json";
type FileSecretProviderConfig = {
  source: "file";
  path: string;
  mode?: FileSecretProviderMode;
  timeoutMs?: number;
  maxBytes?: number;
  allowInsecurePath?: boolean;
};
type ManualExecSecretProviderConfig = {
  source: "exec";
  command: string;
  args?: string[];
  timeoutMs?: number;
  noOutputTimeoutMs?: number;
  maxOutputBytes?: number;
  jsonOnly?: boolean;
  env?: Record<string, string>;
  passEnv?: string[];
  trustedDirs?: string[];
  allowInsecurePath?: boolean;
  allowSymlinkCommand?: boolean;
};
type PluginIntegrationSecretProviderConfig = {
  source: "exec";
  pluginIntegration: {
    pluginId: string;
    integrationId: string;
  };
};
type ExecSecretProviderConfig =
  | ManualExecSecretProviderConfig
  | PluginIntegrationSecretProviderConfig;
type SecretProviderConfig =
  | EnvSecretProviderConfig
  | FileSecretProviderConfig
  | ExecSecretProviderConfig;
type SecretsConfig = {
  providers?: Record<string, SecretProviderConfig>;
  defaults?: {
    env?: string;
    file?: string;
    exec?: string;
  };
  resolution?: {
    maxProviderConcurrency?: number;
    maxRefsPerProvider?: number;
    maxBatchBytes?: number;
  };
};
//#endregion
export {
  resolveSecretInputString as A,
  isUnresolvedSecretInputError as C,
  parseEnvTemplateSecretRef as D,
  normalizeSecretInputString as E,
  parseLegacySecretRefEnvMarker as O,
  isSecretRef as S,
  normalizeResolvedSecretInputString as T,
  SecretsConfig as _,
  FileSecretProviderConfig as a,
  coerceSecretRef as b,
  LEGACY_SECRETREF_ENV_MARKER_PREFIX as c,
  SecretInput as d,
  SecretInputStringResolution as f,
  SecretRefSource as g,
  SecretRef as h,
  ExecSecretProviderConfig as i,
  resolveSecretInputRef as k,
  ManualExecSecretProviderConfig as l,
  SecretProviderConfig as m,
  ENV_SECRET_REF_ID_RE as n,
  FileSecretProviderMode as o,
  SecretInputStringResolutionMode as p,
  EnvSecretProviderConfig as r,
  LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX as s,
  DEFAULT_SECRET_PROVIDER_ALIAS as t,
  PluginIntegrationSecretProviderConfig as u,
  UnresolvedSecretInputError as v,
  isValidEnvSecretRefId as w,
  hasConfiguredSecretInput as x,
  assertSecretInputResolved as y,
};
