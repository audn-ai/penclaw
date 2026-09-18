import {
  i as mergeDmAllowFromSources,
  o as resolveGroupAllowFromSources,
} from "./allow-from-o-cfFFcK.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/channels/message-access/effective-allow-from.ts
/**
 * Merge configured direct, group, and pairing-store allowlists into the
 * effective lists consumed by sender and context-visibility checks.
 */
function resolveChannelIngressEffectiveAllowFromLists(params) {
  const allowFrom = Array.isArray(params.allowFrom) ? params.allowFrom : void 0;
  const groupAllowFrom = Array.isArray(params.groupAllowFrom) ? params.groupAllowFrom : void 0;
  return {
    effectiveAllowFrom: normalizeStringEntries(
      mergeDmAllowFromSources({
        allowFrom,
        storeAllowFrom: Array.isArray(params.storeAllowFrom) ? params.storeAllowFrom : void 0,
        dmPolicy: params.dmPolicy ?? void 0,
      }),
    ),
    effectiveGroupAllowFrom: normalizeStringEntries(
      resolveGroupAllowFromSources({
        allowFrom,
        groupAllowFrom,
        fallbackToAllowFrom: params.groupAllowFromFallbackToAllowFrom ?? void 0,
      }),
    ),
  };
}
//#endregion
export { resolveChannelIngressEffectiveAllowFromLists as t };
