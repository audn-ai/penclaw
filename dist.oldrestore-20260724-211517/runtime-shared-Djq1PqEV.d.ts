import { n as PluginManifestRegistry } from "./manifest-registry-CHEq75Tu.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { h as SecretRef } from "./types.secrets-C15Z_eLX.js";

//#region src/secrets/resolve-types.d.ts
/** Shared per-runtime cache for resolved SecretRefs and file provider payloads. */
type SecretRefResolveCache = {
  /** In-flight or completed resolution promise keyed by `secretRefKey(ref)`. */ resolvedByRefKey?: Map<
    string,
    Promise<unknown>
  > /** In-flight or completed parsed file-provider payload keyed by provider alias. */;
  filePayloadByProvider?: Map<string, Promise<unknown>>;
};
//#endregion
//#region src/secrets/runtime-shared.d.ts
type SecretResolverWarningCode =
  | "SECRETS_REF_OVERRIDES_PLAINTEXT"
  | "SECRETS_REF_IGNORED_INACTIVE_SURFACE"
  | "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT"
  | "WEB_SEARCH_AUTODETECT_SELECTED"
  | "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED"
  | "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK"
  | "WEB_FETCH_PROVIDER_INVALID_AUTODETECT"
  | "WEB_FETCH_AUTODETECT_SELECTED"
  | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED"
  | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";
type SecretResolverWarning = {
  code: SecretResolverWarningCode;
  path: string;
  message: string;
};
type SecretAssignment = {
  ref: SecretRef;
  path: string;
  expected: "string" | "string-or-object";
  apply: (value: unknown) => void;
};
type ResolverContext = {
  sourceConfig: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  cache: SecretRefResolveCache;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  warnings: SecretResolverWarning[];
  warningKeys: Set<string>;
  assignments: SecretAssignment[];
};
type SecretDefaults = NonNullable<OpenClawConfig["secrets"]>["defaults"];
/**
 * Creates the mutable collection context used while preparing a secrets runtime snapshot.
 */
declare function createResolverContext(params: {
  sourceConfig: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): ResolverContext;
/**
 * Records a SecretRef assignment that should be resolved and applied later.
 */
declare function pushAssignment(context: ResolverContext, assignment: SecretAssignment): void;
/**
 * Records a resolver warning once per code/path/message tuple.
 */
declare function pushWarning(context: ResolverContext, warning: SecretResolverWarning): void;
/**
 * Emits the standard warning for refs configured on currently inactive surfaces.
 */
declare function pushInactiveSurfaceWarning(params: {
  context: ResolverContext;
  path: string;
  details?: string;
}): void;
/**
 * Converts an inline SecretInput value into a deferred assignment when its surface is active.
 */
declare function collectSecretInputAssignment(params: {
  value: unknown;
  path: string;
  expected: SecretAssignment["expected"];
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  active?: boolean;
  inactiveReason?: string;
  apply: (value: unknown) => void;
}): void;
/**
 * Applies resolved SecretRef values to their collected config targets with shape validation.
 */
declare function applyResolvedAssignments(params: {
  assignments: SecretAssignment[];
  resolved: Map<string, unknown>;
}): void;
/**
 * Own-property helper used by config collectors that receive unknown object shapes.
 */
declare function hasOwnProperty(record: Record<string, unknown>, key: string): boolean;
/**
 * Treats missing or non-object enabled state as enabled by default.
 */
declare function isEnabledFlag(value: unknown): boolean;
/**
 * Returns whether both a channel and one account are enabled for secret resolution.
 */
declare function isChannelAccountEffectivelyEnabled(
  channel: Record<string, unknown>,
  account: Record<string, unknown>,
): boolean;
//#endregion
export {
  SecretResolverWarningCode as a,
  createResolverContext as c,
  isEnabledFlag as d,
  pushAssignment as f,
  SecretRefResolveCache as h,
  SecretResolverWarning as i,
  hasOwnProperty as l,
  pushWarning as m,
  SecretAssignment as n,
  applyResolvedAssignments as o,
  pushInactiveSurfaceWarning as p,
  SecretDefaults as r,
  collectSecretInputAssignment as s,
  ResolverContext as t,
  isChannelAccountEffectivelyEnabled as u,
};
