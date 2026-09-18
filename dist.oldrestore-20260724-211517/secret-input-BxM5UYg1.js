//#region packages/memory-host-sdk/src/host/secret-input-utils.ts
const DEFAULT_SECRET_PROVIDER_ALIAS = "default";
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
const LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:";
const ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
const SECRET_REF_SOURCES = /* @__PURE__ */ new Set(["env", "file", "exec"]);
/** Narrow unknown JSON config values to plain records. */
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Normalize literal secret strings and reject empty placeholders. */
function normalizeSecretInputString(value) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
/** Narrow a string to a supported SecretRef source. */
function hasSecretRefSource(value) {
  return typeof value === "string" && SECRET_REF_SOURCES.has(value);
}
/** Narrow unknown values to non-empty strings. */
function hasNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
/** Detect canonical three-field SecretRef objects. */
function isSecretRef(value) {
  if (!isRecord(value)) return false;
  return (
    Object.keys(value).length === 3 &&
    hasSecretRefSource(value.source) &&
    hasNonEmptyString(value.provider) &&
    hasNonEmptyString(value.id)
  );
}
/** Detect legacy refs that predate explicit provider names. */
function isLegacySecretRefWithoutProvider(value) {
  if (!isRecord(value)) return false;
  return (
    hasSecretRefSource(value.source) && hasNonEmptyString(value.id) && value.provider === void 0
  );
}
/** Parse env template shorthand such as "${OPENAI_API_KEY}". */
function parseEnvTemplateSecretRef(value) {
  if (typeof value !== "string") return null;
  const match = ENV_SECRET_TEMPLATE_RE.exec(value.trim());
  if (!match) return null;
  return {
    source: "env",
    provider: DEFAULT_SECRET_PROVIDER_ALIAS,
    id: match[1] ?? "",
  };
}
/** Parse legacy secretref-env markers from older config snapshots. */
function parseLegacySecretRefEnvMarker(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith(LEGACY_SECRETREF_ENV_MARKER_PREFIX)) return null;
  const id = trimmed.slice(14);
  if (!ENV_SECRET_REF_ID_RE.test(id)) return null;
  return {
    source: "env",
    provider: DEFAULT_SECRET_PROVIDER_ALIAS,
    id,
  };
}
/** Coerce all accepted shipped secret reference shapes to canonical SecretRef. */
function coerceSecretRef(value) {
  if (isSecretRef(value)) return value;
  if (isLegacySecretRefWithoutProvider(value))
    return {
      source: value.source,
      provider: DEFAULT_SECRET_PROVIDER_ALIAS,
      id: value.id,
    };
  return parseEnvTemplateSecretRef(value) ?? parseLegacySecretRefEnvMarker(value);
}
/** Return true when a secret input has either a literal value or resolvable reference shape. */
function hasConfiguredMemorySecretInputValue(value) {
  if (normalizeSecretInputString(value)) return true;
  return coerceSecretRef(value) !== null;
}
/** Format a ref label without revealing a resolved secret value. */
function formatSecretRefLabel(ref) {
  return `${ref.source}:${ref.provider}:${ref.id}`;
}
/** Build the unresolved-ref error used when callers bypass gateway secret resolution. */
function createUnresolvedSecretInputError(params) {
  return /* @__PURE__ */ new Error(
    `${params.path}: unresolved SecretRef "${formatSecretRefLabel(params.ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`,
  );
}
/** Return a canonical SecretRef when the input is a supported reference shape. */
function resolveMemorySecretInputRef(value) {
  return coerceSecretRef(value);
}
/** Normalize literal secrets, or throw for refs that still require gateway resolution. */
function normalizeResolvedMemorySecretInputString(params) {
  const normalized = normalizeSecretInputString(params.value);
  if (normalized) return normalized;
  const ref = resolveMemorySecretInputRef(params.value);
  if (!ref) return;
  throw createUnresolvedSecretInputError({
    path: params.path,
    ref,
  });
}
/** Normalize env-provided secret values before use. */
function normalizeEnvSecretInputString(value) {
  return normalizeSecretInputString(value);
}
//#endregion
//#region packages/memory-host-sdk/src/host/secret-input.ts
/** Return true when a configured memory secret contains a literal value or reference. */
function hasConfiguredMemorySecretInput(value) {
  return hasConfiguredMemorySecretInputValue(value);
}
/** Resolve memory secret input, reading env refs directly when available. */
function resolveMemorySecretInputString(params) {
  const ref = resolveMemorySecretInputRef(params.value);
  if (ref?.source === "env") {
    const envValue = normalizeEnvSecretInputString(process.env[ref.id]);
    if (envValue) return envValue;
  }
  return normalizeResolvedMemorySecretInputString({
    value: params.value,
    path: params.path,
  });
}
//#endregion
export { resolveMemorySecretInputString as n, hasConfiguredMemorySecretInput as t };
