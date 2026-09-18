import { s as LineGroupConfig } from "./accounts-BVYvjU3t.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/line/src/group-keys.d.ts
declare function resolveLineGroupLookupIds(groupId?: string | null): string[];
declare function resolveLineGroupConfigEntry<T>(
  groups: Record<string, T | undefined> | undefined,
  params: {
    groupId?: string | null;
    roomId?: string | null;
  },
): T | undefined;
declare function resolveLineGroupsConfig(
  cfg: OpenClawConfig,
  accountId?: string | null,
): Record<string, LineGroupConfig | undefined> | undefined;
declare function resolveExactLineGroupConfigKey(params: {
  groups: Record<string, unknown> | undefined;
  groupId?: string | null;
}): string | undefined;
//#endregion
export {
  resolveLineGroupsConfig as i,
  resolveLineGroupConfigEntry as n,
  resolveLineGroupLookupIds as r,
  resolveExactLineGroupConfigKey as t,
};
