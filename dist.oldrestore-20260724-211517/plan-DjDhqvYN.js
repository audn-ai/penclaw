import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { o as isValidSecretProviderAlias, s as isValidSecretRef } from "./ref-contract-DVV0zYUk.js";
import { a as parseDotPath, c as toDotPath } from "./shared-CrrsbqCi.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { l as resolvePlanTargetAgainstRegistry } from "./target-registry-query-CH3KJb3I.js";
import { D as SecretProviderSchema } from "./zod-schema.core-CWTCY1ZZ.js";
import "./target-registry-Db69vEew.js";
//#region src/secrets/plan.ts
/** Validates and normalizes serialized secrets apply plans before config mutation. */
function isSecretProviderConfigShape(value) {
  return SecretProviderSchema.safeParse(value).success;
}
/** Resolves a user-supplied plan target through the registry after path safety checks. */
function resolveValidatedPlanTarget(candidate) {
  if (typeof candidate.type !== "string" || !candidate.type.trim()) return null;
  const path = typeof candidate.path === "string" ? candidate.path.trim() : "";
  if (!path) return null;
  const segments =
    Array.isArray(candidate.pathSegments) && candidate.pathSegments.length > 0
      ? normalizeStringEntries(candidate.pathSegments)
      : parseDotPath(path);
  if (segments.length === 0 || segments.some(isBlockedObjectKey) || path !== toDotPath(segments))
    return null;
  return resolvePlanTargetAgainstRegistry({
    type: candidate.type,
    pathSegments: segments,
    providerId: candidate.providerId,
    accountId: candidate.accountId,
  });
}
/** Validates the external secrets apply plan shape and every target/provider mutation. */
function isSecretsApplyPlan(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const typed = value;
  if (typed.version !== 1 || typed.protocolVersion !== 1 || !Array.isArray(typed.targets))
    return false;
  for (const target of typed.targets) {
    if (!target || typeof target !== "object") return false;
    const candidate = target;
    const ref = candidate.ref;
    const resolved = resolveValidatedPlanTarget({
      type: candidate.type,
      path: candidate.path,
      pathSegments: candidate.pathSegments,
      agentId: candidate.agentId,
      providerId: candidate.providerId,
      accountId: candidate.accountId,
      authProfileProvider: candidate.authProfileProvider,
    });
    if (
      typeof candidate.path !== "string" ||
      !candidate.path.trim() ||
      (candidate.pathSegments !== void 0 && !Array.isArray(candidate.pathSegments)) ||
      !resolved ||
      !ref ||
      typeof ref !== "object" ||
      (ref.source !== "env" && ref.source !== "file" && ref.source !== "exec") ||
      typeof ref.provider !== "string" ||
      ref.provider.trim().length === 0 ||
      typeof ref.id !== "string" ||
      ref.id.trim().length === 0 ||
      !isValidSecretRef(ref)
    )
      return false;
    if (resolved.entry.configFile === "auth-profiles.json") {
      if (typeof candidate.agentId !== "string" || candidate.agentId.trim().length === 0)
        return false;
      if (
        candidate.authProfileProvider !== void 0 &&
        (typeof candidate.authProfileProvider !== "string" ||
          candidate.authProfileProvider.trim().length === 0)
      )
        return false;
    }
  }
  if (typed.providerUpserts !== void 0) {
    if (!isRecord(typed.providerUpserts)) return false;
    for (const [providerAlias, providerValue] of Object.entries(typed.providerUpserts)) {
      if (!isValidSecretProviderAlias(providerAlias)) return false;
      if (!isSecretProviderConfigShape(providerValue)) return false;
    }
  }
  if (typed.providerDeletes !== void 0) {
    if (
      !Array.isArray(typed.providerDeletes) ||
      typed.providerDeletes.some(
        (providerAlias) =>
          typeof providerAlias !== "string" || !isValidSecretProviderAlias(providerAlias),
      )
    )
      return false;
  }
  return true;
}
/** Normalizes omitted plan options to the apply-time defaults. */
function normalizeSecretsPlanOptions(options) {
  return {
    scrubEnv: options?.scrubEnv ?? true,
    scrubAuthProfilesForProviderTargets: options?.scrubAuthProfilesForProviderTargets ?? true,
    scrubLegacyAuthJson: options?.scrubLegacyAuthJson ?? true,
  };
}
//#endregion
export {
  normalizeSecretsPlanOptions as n,
  resolveValidatedPlanTarget as r,
  isSecretsApplyPlan as t,
};
