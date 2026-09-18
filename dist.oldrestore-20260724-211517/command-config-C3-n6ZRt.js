import { n as getPath } from "./path-utils-h0yoktZC.js";
import { r as isExpectedResolvedSecretValue } from "./secret-value-BtpfhOEU.js";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-CH3KJb3I.js";
import { g as resolveSecretInputRef, s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
import "./target-registry-Db69vEew.js";
//#region src/secrets/command-config.ts
/**
 * Compares source SecretRefs with the active resolved snapshot for command-time assignments.
 */
/** Analyzes command secret assignments without mutating the source config. */
function analyzeCommandSecretAssignmentsFromSnapshot(params) {
  const defaults = params.sourceConfig.secrets?.defaults;
  const assignments = [];
  const diagnostics = [];
  const unresolved = [];
  const inactive = [];
  for (const target of discoverConfigSecretTargetsByIds(params.sourceConfig, params.targetIds)) {
    if (params.allowedPaths && !params.allowedPaths.has(target.path)) continue;
    const { explicitRef, ref } = resolveSecretInputRef({
      value: target.value,
      refValue: target.refValue,
      defaults,
    });
    const inlineCandidateRef = explicitRef ? coerceSecretRef(target.value, defaults) : null;
    if (!ref) continue;
    const resolved = getPath(params.resolvedConfig, target.pathSegments);
    if (!isExpectedResolvedSecretValue(resolved, target.entry.expectedResolvedValue)) {
      if (params.inactiveRefPaths?.has(target.path)) {
        diagnostics.push(
          `${target.path}: secret ref is configured on an inactive surface; skipping command-time assignment.`,
        );
        inactive.push({
          path: target.path,
          pathSegments: [...target.pathSegments],
        });
        continue;
      }
      unresolved.push({
        path: target.path,
        pathSegments: [...target.pathSegments],
      });
      continue;
    }
    assignments.push({
      path: target.path,
      pathSegments: [...target.pathSegments],
      value: resolved,
    });
    if (target.entry.secretShape === "sibling_ref" && explicitRef && inlineCandidateRef)
      diagnostics.push(
        `${target.path}: both inline and sibling ref were present; sibling ref took precedence.`,
      );
  }
  return {
    assignments,
    diagnostics,
    unresolved,
    inactive,
  };
}
//#endregion
export { analyzeCommandSecretAssignmentsFromSnapshot as t };
