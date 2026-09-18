import "./types.secrets-BV0ywRAy.js";
import "./resolve-Dvpn9c2h.js";
import "./runtime-shared-CE1Ki5Mc.js";
import { u as resolveSecretPlanTargetByPath$1 } from "./target-registry-query-CH3KJb3I.js";
//#region src/plugin-sdk/secret-ref-runtime.ts
function resolveSecretPlanTargetByPath(params) {
  const resolved = resolveSecretPlanTargetByPath$1(params);
  if (!resolved) return null;
  return {
    targetType: resolved.entry.targetType,
    ...(resolved.providerId ? { providerId: resolved.providerId } : {}),
    ...(resolved.accountId ? { accountId: resolved.accountId } : {}),
  };
}
//#endregion
export { resolveSecretPlanTargetByPath as t };
