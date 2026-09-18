import { n as resolveSecretRefValues } from "../resolve-B20TjsQr.js";
import {
  c as createResolverContext,
  o as applyResolvedAssignments,
} from "../runtime-shared-Djq1PqEV.js";
import {
  b as coerceSecretRef,
  d as SecretInput,
  h as SecretRef,
} from "../types.secrets-C15Z_eLX.js";

//#region src/plugin-sdk/secret-ref-runtime.d.ts
type ResolvedSecretPlanTarget = {
  targetType: string;
  providerId?: string;
  accountId?: string;
};
declare function resolveSecretPlanTargetByPath(params: {
  configFile: "openclaw.json" | "auth-profiles.json";
  pathSegments: string[];
}): ResolvedSecretPlanTarget | null;
//#endregion
export {
  ResolvedSecretPlanTarget,
  type SecretInput,
  type SecretRef,
  applyResolvedAssignments,
  coerceSecretRef,
  createResolverContext,
  resolveSecretPlanTargetByPath,
  resolveSecretRefValues,
};
