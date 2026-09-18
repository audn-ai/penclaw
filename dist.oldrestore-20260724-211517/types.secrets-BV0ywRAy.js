import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./utils-DtcDeqWS.js";
//#region src/config/types.secrets.ts
/** Provider alias used when a SecretRef omits a source-specific provider. */
const DEFAULT_SECRET_PROVIDER_ALIAS = "default";
/** Strict env-var id shape accepted for env-backed SecretRefs. */
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
/** Legacy env SecretRef marker retained for config migration/read compatibility. */
const LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:";
/** Older env SecretRef marker retained for migration/read compatibility. */
const LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX = "__env__:";
const ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
const ENV_SECRET_SHORTHAND_RE = /^\$([A-Z][A-Z0-9_]{0,127})$/;
/** Return whether an env SecretRef id is a supported uppercase environment variable name. */
function isValidEnvSecretRefId(value) {
  return ENV_SECRET_REF_ID_RE.test(value);
}
/** Narrow a value to the canonical SecretRef object shape. */
function isSecretRef(value) {
  if (!isRecord(value)) return false;
  if (Object.keys(value).length !== 3) return false;
  return (
    (value.source === "env" || value.source === "file" || value.source === "exec") &&
    typeof value.provider === "string" &&
    value.provider.trim().length > 0 &&
    typeof value.id === "string" &&
    value.id.trim().length > 0
  );
}
function isLegacySecretRefWithoutProvider(value) {
  if (!isRecord(value)) return false;
  return (
    (value.source === "env" || value.source === "file" || value.source === "exec") &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    value.provider === void 0
  );
}
/** Parse `$NAME` and `${NAME}` env-secret shorthand strings into env SecretRefs. */
function parseEnvTemplateSecretRef(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  const match = ENV_SECRET_TEMPLATE_RE.exec(trimmed) ?? ENV_SECRET_SHORTHAND_RE.exec(trimmed);
  if (!match) return null;
  return {
    source: "env",
    provider: provider.trim() || "default",
    id: expectDefined(match[1], "types.secrets regex capture 1"),
  };
}
/** Parse legacy env SecretRef marker strings kept for config migration/read compatibility. */
function parseLegacySecretRefEnvMarker(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  const prefix = trimmed.startsWith("secretref-env:")
    ? LEGACY_SECRETREF_ENV_MARKER_PREFIX
    : trimmed.startsWith("__env__:")
      ? LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX
      : void 0;
  if (!prefix) return null;
  const id = trimmed.slice(prefix.length);
  if (!ENV_SECRET_REF_ID_RE.test(id)) return null;
  return {
    source: "env",
    provider: provider.trim() || "default",
    id,
  };
}
/** Coerce canonical, legacy, and env-shorthand secret inputs into a SecretRef. */
function coerceSecretRef(value, defaults) {
  if (isSecretRef(value)) return value;
  const legacyEnvMarker = parseLegacySecretRefEnvMarker(value, defaults?.env);
  if (legacyEnvMarker) return legacyEnvMarker;
  if (isLegacySecretRefWithoutProvider(value)) {
    const provider =
      value.source === "env"
        ? (defaults?.env ?? "default")
        : value.source === "file"
          ? (defaults?.file ?? "default")
          : (defaults?.exec ?? "default");
    return {
      source: value.source,
      provider,
      id: value.id,
    };
  }
  const envTemplate = parseEnvTemplateSecretRef(value, defaults?.env);
  if (envTemplate) return envTemplate;
  return null;
}
/** Return whether a value contains either a literal secret string or resolvable SecretRef shape. */
function hasConfiguredSecretInput(value, defaults) {
  if (normalizeSecretInputString(value)) return true;
  return coerceSecretRef(value, defaults) !== null;
}
/** Trim a literal secret input string while leaving non-string inputs unresolved. */
function normalizeSecretInputString(value) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function formatSecretRefLabel(ref) {
  return `${ref.source}:${ref.provider}:${ref.id}`;
}
/** Error thrown when strict secret reads encounter a configured but unresolved SecretRef. */
var UnresolvedSecretInputError = class extends Error {
  constructor(params) {
    super(
      `${params.path}: unresolved SecretRef "${formatSecretRefLabel(params.ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`,
    );
    this.name = "UnresolvedSecretInputError";
    this.path = params.path;
    this.ref = params.ref;
  }
};
/** Narrow errors from strict secret read sites without parsing user-facing messages. */
function isUnresolvedSecretInputError(value) {
  return value instanceof UnresolvedSecretInputError;
}
function createUnresolvedSecretInputError(params) {
  return new UnresolvedSecretInputError(params);
}
/** Throw when a secret field still contains an unresolved SecretRef at a read site. */
function assertSecretInputResolved(params) {
  const { ref } = resolveSecretInputRef({
    value: params.value,
    refValue: params.refValue,
    defaults: params.defaults,
  });
  if (!ref) return;
  throw createUnresolvedSecretInputError({
    path: params.path,
    ref,
  });
}
/** Resolve a secret field to either a literal value, a configured-unavailable ref, or missing. */
function resolveSecretInputString(params) {
  const normalized = normalizeSecretInputString(params.value);
  if (normalized)
    return {
      status: "available",
      value: normalized,
      ref: null,
    };
  const { ref } = resolveSecretInputRef({
    value: params.value,
    refValue: params.refValue,
    defaults: params.defaults,
  });
  if (!ref)
    return {
      status: "missing",
      value: void 0,
      ref: null,
    };
  if ((params.mode ?? "strict") === "strict")
    throw createUnresolvedSecretInputError({
      path: params.path,
      ref,
    });
  return {
    status: "configured_unavailable",
    value: void 0,
    ref,
  };
}
/** Return a strict literal secret value, throwing if the field still points at a SecretRef. */
function normalizeResolvedSecretInputString(params) {
  const resolved = resolveSecretInputString({
    ...params,
    mode: "strict",
  });
  if (resolved.status === "available") return resolved.value;
}
/** Resolve explicit `refValue` before inline secret references embedded in `value`. */
function resolveSecretInputRef(params) {
  const explicitRef = coerceSecretRef(params.refValue, params.defaults);
  const inlineRef = explicitRef ? null : coerceSecretRef(params.value, params.defaults);
  return {
    explicitRef,
    inlineRef,
    ref: explicitRef ?? inlineRef,
  };
}
//#endregion
export {
  resolveSecretInputString as _,
  UnresolvedSecretInputError as a,
  hasConfiguredSecretInput as c,
  isValidEnvSecretRefId as d,
  normalizeResolvedSecretInputString as f,
  resolveSecretInputRef as g,
  parseLegacySecretRefEnvMarker as h,
  LEGACY_SECRETREF_ENV_MARKER_PREFIX as i,
  isSecretRef as l,
  parseEnvTemplateSecretRef as m,
  ENV_SECRET_REF_ID_RE as n,
  assertSecretInputResolved as o,
  normalizeSecretInputString as p,
  LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX as r,
  coerceSecretRef as s,
  DEFAULT_SECRET_PROVIDER_ALIAS as t,
  isUnresolvedSecretInputError as u,
};
