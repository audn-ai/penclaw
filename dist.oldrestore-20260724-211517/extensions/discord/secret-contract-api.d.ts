import { r as SecretDefaults, t as ResolverContext } from "../../runtime-shared-Djq1PqEV.js";
import { o as SecretTargetRegistryEntry } from "../../target-registry-types-Dt3AyW6H.js";
//#region extensions/discord/src/secret-config-contract.d.ts
declare const secretTargetRegistryEntries: SecretTargetRegistryEntry[];
declare function collectRuntimeConfigAssignments(params: {
  config: {
    channels?: Record<string, unknown>;
  };
  defaults?: SecretDefaults;
  context: ResolverContext;
}): void;
//#endregion
export { collectRuntimeConfigAssignments, secretTargetRegistryEntries };
